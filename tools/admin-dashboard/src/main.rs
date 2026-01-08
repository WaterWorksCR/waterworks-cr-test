use std::collections::VecDeque;
use std::env;
use std::fs::OpenOptions;
use std::io::{self, Read, Seek, SeekFrom};
use std::path::PathBuf;
use std::time::{Duration, Instant};

use crossterm::event::{self, Event, KeyCode};
use crossterm::terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen};
use crossterm::{execute, terminal};
use ratatui::backend::CrosstermBackend;
use ratatui::layout::{Constraint, Direction, Layout};
use ratatui::style::{Color, Style};
use ratatui::widgets::{Block, Borders, List, ListItem, Paragraph};
use ratatui::Terminal;
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
struct SecurityEvent {
  timestamp: String,
  event: String,
  ip: String,
  username: Option<String>,
  userAgent: Option<String>,
  requestId: Option<String>,
  detail: Option<String>,
}

struct TailState {
  pos: u64,
  remainder: String,
}

impl TailState {
  fn new() -> Self {
    Self {
      pos: 0,
      remainder: String::new(),
    }
  }
}

fn parse_args() -> (PathBuf, usize, bool) {
  let mut log_path = PathBuf::from("data/logs/security.log");
  let mut limit = 200usize;
  let mut bell = true;
  let mut args = env::args().skip(1);
  while let Some(arg) = args.next() {
    match arg.as_str() {
      "--log-path" => {
        if let Some(value) = args.next() {
          log_path = PathBuf::from(value);
        }
      }
      "--limit" => {
        if let Some(value) = args.next() {
          limit = value.parse().unwrap_or(limit);
        }
      }
      "--no-bell" => {
        bell = false;
      }
      "--help" => {
        println!(
          "Usage: admin-dashboard [--log-path <path>] [--limit <n>] [--no-bell]"
        );
        std::process::exit(0);
      }
      _ => {}
    }
  }
  (log_path, limit, bell)
}

fn read_new_events(path: &PathBuf, state: &mut TailState) -> io::Result<Vec<SecurityEvent>> {
  let mut file = OpenOptions::new().read(true).create(true).open(path)?;
  let metadata = file.metadata()?;
  if metadata.len() < state.pos {
    state.pos = 0;
    state.remainder.clear();
  }
  file.seek(SeekFrom::Start(state.pos))?;
  let mut chunk = String::new();
  file.read_to_string(&mut chunk)?;
  state.pos += chunk.len() as u64;
  state.remainder.push_str(&chunk);

  let mut events = Vec::new();
  while let Some(idx) = state.remainder.find('\n') {
    let line = state.remainder[..idx].trim();
    state.remainder = state.remainder[idx + 1..].to_string();
    if line.is_empty() {
      continue;
    }
    if let Ok(event) = serde_json::from_str::<SecurityEvent>(line) {
      events.push(event);
    }
  }
  Ok(events)
}

fn format_event_line(event: &SecurityEvent) -> String {
  let user = event.username.clone().unwrap_or_else(|| "unknown".to_string());
  let ua = event.userAgent.clone().unwrap_or_else(|| "unknown".to_string());
  format!(
    "{} {} ip={} user={} ua={}",
    event.timestamp, event.event, event.ip, user, ua
  )
}

fn event_style(event: &SecurityEvent) -> Style {
  match event.event.as_str() {
    "admin_login_success" => Style::default().fg(Color::Green),
    "admin_login_failed" => Style::default().fg(Color::Red),
    "admin_login_rate_limited" => Style::default().fg(Color::Yellow),
    _ => Style::default().fg(Color::White),
  }
}

fn main() -> io::Result<()> {
  let (log_path, limit, bell) = parse_args();
  let mut tail_state = TailState::new();
  let mut events: VecDeque<SecurityEvent> = VecDeque::with_capacity(limit);
  let mut last_notification = String::from("Waiting for admin login events...");

  enable_raw_mode()?;
  let mut stdout = io::stdout();
  execute!(stdout, EnterAlternateScreen)?;
  let backend = CrosstermBackend::new(stdout);
  let mut terminal = Terminal::new(backend)?;
  terminal.clear()?;

  let mut last_tick = Instant::now();

  loop {
    if last_tick.elapsed() >= Duration::from_millis(400) {
      if let Ok(new_events) = read_new_events(&log_path, &mut tail_state) {
        for event in new_events {
          if events.len() == limit {
            events.pop_front();
          }
          if event.event == "admin_login_success" {
            last_notification = format!(
              "Admin login: {} from {}",
              event.username.clone().unwrap_or_else(|| "unknown".to_string()),
              event.ip
            );
            if bell {
              print!("\x07");
            }
          }
          events.push_back(event);
        }
      }
      last_tick = Instant::now();
    }

    terminal.draw(|frame| {
      let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Length(4), Constraint::Min(1)].as_ref())
        .split(frame.size());

      let header = Paragraph::new(format!(
        "Waterworks Admin Dashboard\nlog: {}\n{}",
        log_path.display(),
        last_notification
      ))
      .block(Block::default().borders(Borders::ALL).title("Status"));
      frame.render_widget(header, chunks[0]);

      let items: Vec<ListItem> = events
        .iter()
        .rev()
        .map(|event| {
          ListItem::new(format_event_line(event)).style(event_style(event))
        })
        .collect();
      let list = List::new(items)
        .block(Block::default().borders(Borders::ALL).title("Security Events"))
        .highlight_style(Style::default().fg(Color::Cyan));
      frame.render_widget(list, chunks[1]);
    })?;

    if event::poll(Duration::from_millis(50))? {
      if let Event::Key(key) = event::read()? {
        if key.code == KeyCode::Char('q') {
          break;
        }
      }
    }
  }

  disable_raw_mode()?;
  execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
  terminal.show_cursor()?;
  Ok(())
}
