# EduConnect

![Type](https://img.shields.io/badge/Type-Full--Stack%20Web%20Application-0ea5e9)
![Domain](https://img.shields.io/badge/Domain-Education%20Support-16a34a)
![Status](https://img.shields.io/badge/Status-Active%20Development-f59e0b)

Student support platform focused on forum discussion, counseling workflows, resource access, and academic progress visibility.

## Open This First

1. `app.js` - Application bootstrap and middleware registration
2. `routes/` - Route-level feature boundaries
3. `controllers/` - Business workflow handlers
4. `middleware/` - Auth, validation, and security checks

## Project Overview

EduConnect is designed to centralize student support functions that are usually split across disconnected systems. It combines communication, counseling, learning resources, and profile-level progress context in one platform.

## Problem Statement

Student support operations are often fragmented:
- community discussion in one place
- counseling coordination in another
- resource tracking in separate channels

EduConnect addresses this by providing a unified, role-aware workflow for students and platform administrators.

## Core Features

1. Authentication and access control
2. Forum and community threads
3. Counseling request workflow
4. Resource discovery and bookmarking
5. Progress tracker and analytics
6. Profile management
7. Admin monitoring dashboard

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB (via Mongoose)
- Frontend: HTML, CSS, JavaScript (served via Express)
- Security: Helmet, rate limiting, mongo sanitize, XSS clean, HPP
- Utilities: JWT, bcryptjs, nodemailer, multer

## Architecture Snapshot

- `app.js` initializes middleware, routes, and DB connectivity
- `routes/` maps endpoints by feature area
- `controllers/` contains request-level business logic
- `middleware/` enforces auth/security boundaries
- `utils/` stores reusable helper functions

## Setup and Run

```bash
npm install
npm run dev
```

Production start:

```bash
npm start
```

Default URL: `http://localhost:5000`

## Health Check Endpoint

- `GET /health`

## Folder Structure

```text
EduConnect/
|- app.js
|- config/
|- controllers/
|- middleware/
|- public/
|- routes/
|- utils/
|- .env.example
```

## Screenshots and Demo

- Portfolio case-study page: https://alishah1029384756.github.io/AliShah1029384756/projects/educonnect.html

## Outcomes and Learning

- Practical full-stack architecture with modular route/controller flow
- Security middleware layering for student-facing platform hardening
- Workflow-first feature design for education support use-cases

## Status

- Current state: Active development-ready codebase
- Code organization: Modular and extendable
- Documentation style: Professional project-grade structure

## Security Notes

- Keep credentials in `.env` only
- Never commit production secrets
- Validate role/auth middleware before deployment

## Useful References

- [Express.js Guide](https://expressjs.com/) - Routing and middleware reference
- [Mongoose Docs](https://mongoosejs.com/docs/) - Schema, model, and query reference
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) - Authentication and session security guidance
- [Node.js Docs](https://nodejs.org/en/docs) - Runtime and standard library reference

## License and Contact

- License: Add repository license file if publishing externally
- Maintainer: Syed Muhammad Ali Naqvi
- GitHub: https://github.com/AliShah1029384756

Last verified: April 1, 2026
