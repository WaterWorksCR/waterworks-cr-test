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

you can also use env vars:

```
ADMIN_USERNAME=<name> ADMIN_PASSWORD=<pass> node scripts/create-admin.js
```

migrating a vps: copy the `data/app.db` file to the new server.
