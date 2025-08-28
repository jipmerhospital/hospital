# Hospital Registration API

## Quick start
```bash
cp .env.example .env
# edit MONGO_URI if needed
npm install
npm run dev
```
Seed admin user:
- email: `admin@example.com`
- password: `Admin@123`

Use the token from `/api/auth/login` for all `/api/patients/*` calls (Authorization: Bearer TOKEN).
