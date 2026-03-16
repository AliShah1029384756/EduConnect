# Profile Image Storage Strategy

## Development
- Current implementation accepts image upload via multer memory storage.
- Image is returned as data URL and stored in memory user record.

## Production recommendation
1. Store files in object storage (S3, Cloudinary, Supabase Storage).
2. Save only URL + metadata in user profile document.
3. Validate MIME (`image/png`, `image/jpeg`, `image/webp`) and max size.
4. Generate transformed thumbnails for fast profile rendering.
5. Add periodic cleanup for replaced assets.
