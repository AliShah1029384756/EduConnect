# EduConnect Professionalization TODO

## Phase 1 - Stabilize Core (High Priority)
- [x] Fix corrupted `public/register.html` and restore working registration flow.
- [x] Replace incorrect `public/js/counseling.js` with booking/list logic.
- [x] Unify auth client utilities in `public/js/auth.js` (`signin`, `signup`, forgot password, session helpers).
- [x] Remove broken redirects to `index1.html`; use `login.html` consistently.
- [x] Restore missing backend directories and files:
  - `controllers/`
  - `middleware/`
  - `config/` (e.g., multer)
  - `models/`
- [x] Fix `routes/forumRoutes.js` middleware import and define `GET /api/forum/all` endpoint.

## Phase 2 - UX and Visual Polish (High Priority)
- [x] Replace duplicated CSS with a cleaner design system (`public/css/styles.css`).
- [x] Redesign home hero section and feature cards for stronger first impression.
- [x] Improve login/forgot-password visual consistency without missing image dependencies.
- [x] Add consistent success/error toast component instead of browser `alert()`.
- [x] Add loading and empty states to all dashboard pages (admin/profile/forum/counseling).

## Phase 3 - Product Completeness (Medium Priority)
- [x] Complete auth pages: email verification, reset password confirmation page.
- [x] Complete profile image upload backend and file storage strategy.
- [x] Add admin dashboard endpoint (`/api/admin/dashboard`) and analytics aggregation.
- [ ] Add forum filtering (recent, most discussed) and pagination.
- [x] Add counseling lifecycle actions (confirm, reschedule, cancel).

## Phase 4 - Quality, Security, and Deploy (Medium Priority)
- [x] Add `.env.example` with required variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
- [x] Add backend validation for all payloads (Joi/Zod/express-validator).
- [x] Add integration tests for auth + forum + counseling routes.
- [x] Add linting and formatting (`eslint`, `prettier`) with scripts in `package.json`.
- [x] Add Dockerfile and deployment guide for Render/Railway/Vercel split setup.

## Phase 5 - Professional Finishing (Lower Priority)
- [x] Build brand assets (`logo.svg`, favicon, social preview image).
- [x] Add About, Contact, and Privacy pages.
- [ ] Add accessibility pass (color contrast, aria labels, keyboard navigation).
- [ ] Improve performance: image optimization, caching headers, code splitting plan.
