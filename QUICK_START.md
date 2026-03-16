# Quick Start (Fun Mode)

Use this if you just want it running fast without full production setup.

## 1. Install once
```powershell
npm install
```

## 2. Run
```powershell
npm start
```

The app runs even without MongoDB now (it falls back to in-memory demo data).

## 3. Open in browser
- `http://127.0.0.1:5000`

## 4. Demo admin login
- Email: `admin@educonnect.local`
- Password: `admin123`

## If port 5000 is busy
```powershell
$env:PORT=5001; npm start
```

Then open `http://127.0.0.1:5001`.

## Notes
- Data in fun mode resets when server restarts (in-memory).
- For persistent storage later, set `MONGODB_URI` in `.env` from `.env.example`.
