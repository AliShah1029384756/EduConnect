# EduConnect

EduConnect is a student-focused platform that combines:
- User authentication
- Community forum discussions
- Counseling session booking
- Basic admin dashboard and moderation tools

## Current Project State
This branch contains a professionalization pass with:
- Frontend redesign and UX cleanup
- Backend route/controller scaffolding
- In-memory fallback mode when MongoDB is not configured
- Validation, linting, formatting, and initial integration tests
- Deployment and Docker setup docs

## Quick Start
1. Install dependencies:
```powershell
npm install
```

2. Run app:
```powershell
npm start
```

3. Open:
- `http://127.0.0.1:5000`

If MongoDB is not running, the app still works in in-memory mode.

## MongoDB (Local)
Use local MongoDB URI in `.env`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/educonnect
```

Example full env is provided in `.env.example`.

## Scripts
- `npm start` - Run production server
- `npm run dev` - Run with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

## Main Files Added/Updated
- `app.js`
- `routes/`, `controllers/`, `middleware/`, `models/`, `config/`
- `public/` pages and scripts
- `tests/api.test.js`
- `DEPLOYMENT.md`, `Dockerfile`, `TODO.md`, `QUICK_START.md`

## Notes
- `.env` is intentionally ignored by git.
- Demo mode data resets on restart when MongoDB is unavailable.
