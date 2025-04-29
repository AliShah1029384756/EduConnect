const express = require('express');
const path = require('path');
const app = express();
const mailController = require('./controllers/mailController');

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Static files: CSS/JS
app.set('view engine', 'ejs'); // EJS as the template engine
app.use(express.json()); // For parsing JSON data in POST requests

// Routes
app.get('/', (req, res) => {
  res.render('home'); // home.ejs will be rendered (make sure it exists)
});

app.post('/api/send-email', mailController.sendMail); // Email POST route

// Server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
