# Admin dashboard (ratatui)

This tool tails the security log and highlights admin login activity.

## Run

```
cargo run -- --log-path ../../data/logs/security.log
```

Options:
- `--limit <n>`: number of log lines to keep in memory.
- `--no-bell`: disable terminal bell on successful login.
- `--log-path <path>`: custom log file path.

Press `q` to quit.
