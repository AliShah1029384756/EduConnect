# Performance Plan

## Current quick wins
- Compress static assets (gzip/brotli at reverse proxy).
- Cache static files from `public/` with immutable headers.
- Reduce bootstrap/icon CDN calls by pinning and preconnecting.

## Backend
- Add pagination defaults for forum and sessions endpoints.
- Add query indexes for Mongo models (`createdAt`, `email`, `userId`).
- Replace in-memory payload images with object storage URLs.

## Frontend
- Lazy-load less-used pages (admin, profile) when possible.
- Use responsive images for hero/media assets.
- Minimize blocking JS on auth pages.
