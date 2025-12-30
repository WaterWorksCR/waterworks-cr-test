# Deployment (Ubuntu VPS + Cloudflare)

## 1) System setup
- Install Node.js LTS and build tools:
  - `sudo apt update`
  - `sudo apt install -y nodejs npm build-essential python3`
- Optional: install Node via nvm for easier upgrades.

## 2) App setup
- Clone the repo and install dependencies:
  - `npm ci` (or `npm install`)
- Create a `.env` file with:
  - `ADMIN_USERNAME=...`
  - `ADMIN_PASSWORD=...`
  - `NODE_ENV=production`
- Build and start:
  - `npm run build`
  - `npm run start`

## 3) Run as a service (systemd)
Create `/etc/systemd/system/waterworks.service`:
```
[Unit]
Description=Waterworks Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/waterworks
Environment=NODE_ENV=production
Environment=ADMIN_USERNAME=your_username
Environment=ADMIN_PASSWORD=your_password
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```
Then:
- `sudo systemctl daemon-reload`
- `sudo systemctl enable --now waterworks`
- `sudo systemctl status waterworks`

## 4) Nginx reverse proxy
Create `/etc/nginx/sites-available/waterworks`:
```
server {
  listen 80;
  server_name example.com www.example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
Enable it:
- `sudo ln -s /etc/nginx/sites-available/waterworks /etc/nginx/sites-enabled/waterworks`
- `sudo nginx -t`
- `sudo systemctl reload nginx`

## 5) Cloudflare + TLS
- Point DNS A/AAAA to the VPS.
- Set SSL/TLS mode to **Full (strict)**.
- Install a Cloudflare Origin Certificate on the VPS and configure Nginx for HTTPS.
- Enable Automatic HTTPS Rewrites and Always Use HTTPS.

## 6) Firewall
```
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 7) Database and backups
- The app uses SQLite at `data/app.db`.
- Back up nightly:
```
sqlite3 /var/www/waterworks/data/app.db ".backup /var/backups/waterworks/app-$(date +%F).db"
```
- Sync backups to off-box storage (S3/R2) for safety.

## 8) Logs
- `journalctl -u waterworks -f`
- Use logrotate if logs grow quickly.
