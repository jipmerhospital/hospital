# MERN Hospital Registration (Clerk/Admin)

Features:
- Clerk: create/edit/view/print patient registrations.
- Admin: add clerks and see analytics (filter by form fields).
- Unique Hospital Number: auto-increment like YA00001, YA00002... on save (atomic counter).

## Run Backend
```bash
cd server
cp .env.example .env
# edit MONGO_URI if needed
npm install
npm run dev
```
The first run seeds an admin:
- email: `admin@example.com`
- password: `Admin@123`

## Run Frontend
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

## Notes
- Printing: use the "Print" button on form or in list (opens browser print).
- Auth: simple JWT; protect all patient routes. Admin-only clerk creation is simplified via header in this demo; in production, secure with middleware.
- Required fields enforced both in UI and API.
