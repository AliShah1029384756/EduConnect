# EduConnect

EduConnect is an educational platform project built with Node.js, Express, and static frontend assets (HTML/CSS/JavaScript).

## Status

- Upload-ready for private repository storage and future extension.
- Backend routes and middleware are structured and runnable.
- Frontend is served from `public/`.
- Core student-value modules are implemented: forum, counseling, resources, tracker, profile, and admin panel.

## Tech Stack

- Node.js
- Express.js
- MongoDB (optional in local bootstrap mode)
- Vanilla HTML/CSS/JavaScript frontend

## Project Structure

```text
EduConnect/
|- app.js
|- package.json
|- .env.example
|- config/
|  |- multer.js
|- controllers/
|  |- adminController.js
|  |- authController.js
|  |- counselingController.js
|  |- forumController.js
|  |- mailController.js
|  |- profileController.js
|- middleware/
|  |- auth.js
|  |- errorHandler.js
|- routes/
|  |- adminRoutes.js
|  |- authRoutes.js
|  |- counselingRoutes.js
|  |- forumRoutes.js
|  |- mailRoutes.js
|  |- profileRoutes.js
|- public/
|  |- index.html
|  |- login.html
|  |- register.html
|  |- ...
|- utils/
|  |- errorResponse.js
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Start server:

```bash
npm run dev
```

Server default URL: `http://localhost:5000`

## Demo Credentials

- Admin: `admin@educonnect.com`
- Password: `Admin@123`

Use this account to review admin dashboard, role management, and platform metrics.

## Implemented Modules

1. Authentication and session guard
2. Student discussion forum with ownership-based deletion
3. Counseling booking and session tracking
4. Resource discovery with search, filtering, and bookmarking
5. Weekly progress tracker with summary analytics
6. User profile update and image upload
7. Admin dashboard for users, sessions, and platform stats

## Health Check

- Endpoint: `GET /health`
- Expected response:

```json
{
	"success": true,
	"service": "EduConnect API"
}
```

## Notes

- If `MONGODB_URI` is missing, server still starts for API/bootstrap verification.
- Use `JWT_SECRET` in `.env` before protected route testing.
- This repository is intended to remain private unless explicitly published.
