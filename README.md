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

use pm2 restart waterworks-cr-test to after rebuild
