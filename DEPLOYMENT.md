# Deployment Guide

## Local Docker
1. Copy `.env.example` to `.env` and update values.
2. Build image: `docker build -t educonnect .`
3. Run container: `docker run -p 5000:5000 --env-file .env educonnect`

## Render/Railway (Node API)
1. Connect repository.
2. Set start command: `npm start`.
3. Set environment variables from `.env.example`.
4. Add MongoDB service and set `MONGODB_URI`.

## Vercel (Frontend-Only Static Option)
1. Serve `/public` as static assets.
2. Point API requests to deployed backend base URL.
3. Set `CLIENT_URL` to frontend domain in backend env.

## Health Check
Use `GET /` and `GET /api/auth/signin` (method not allowed indicates route mounted).
