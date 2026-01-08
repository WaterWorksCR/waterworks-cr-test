# waterworks cr website

to deploy ts 
npm run build
npm run start
dont forget to buy new domain and not use main domain

## admin users

create an admin user in the sqlite db:

```
node scripts/create-admin.js --username <name> --password <pass>
```

<<<<<<< HEAD
use pm2 restart waterworks-cr-test to after rebuild
=======
you can also use env vars:

```
ADMIN_USERNAME=<name> ADMIN_PASSWORD=<pass> node scripts/create-admin.js
```

migrating a vps: copy the `data/app.db` file to the new server.

## security + ops

set an admin session secret so cookies are signed:

```
ADMIN_SESSION_SECRET="long-random-string"
```

rate limits (defaults shown):

```
ADMIN_LOGIN_LIMIT=8
ADMIN_LOGIN_WINDOW_MS=60000
CONTACT_RATE_LIMIT=6
CONTACT_RATE_WINDOW_MS=60000
ORDER_RATE_LIMIT=6
ORDER_RATE_WINDOW_MS=60000
```

database backups:

```
npm run backup:db
node scripts/backup-db.js --keep 14 --out-dir /var/backups/waterworks
```

security log (for fail2ban + dashboard):
`data/logs/security.log`

fail2ban templates:
`ops/fail2ban/filter.d/waterworks-admin.conf`
`ops/fail2ban/jail.d/waterworks-admin.local`

rust dashboard (ratatui):

```
cd tools/admin-dashboard
cargo run -- --log-path ../../data/logs/security.log
```
>>>>>>> 5cc3a7c (security update)
