require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Import routes
const authRoutes = require('./routes/authRoutes');
const forumRoutes = require('./routes/forumRoutes');
const profileRoutes = require('./routes/profileRoutes');
const counselingRoutes = require('./routes/counselingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mailRoutes = require('./routes/mailRoutes');
const resourcesRoutes = require('./routes/resourcesRoutes');
const trackerRoutes = require('./routes/trackerRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB connection error:', err.message));
} else {
  console.warn('MONGODB_URI not provided. Server will run without database connection.');
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(limiter);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, service: 'EduConnect API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/counseling', counselingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/tracker', trackerRoutes);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});