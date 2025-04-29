// controllers/mailController.js

// Nodemailer library import kar rahe hain
const nodemailer = require('nodemailer');

// sendMail naam ka function banaya hai jo export kiya ja raha hai
exports.sendMail = async (req, res) => {
  // Frontend/postman se yeh 3 cheezen milengi
  const { to, subject, text } = req.body;

  // Transporter banate hain (yeh Gmail ka setup hai)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',       // ← Apna Gmail yahan likho
      pass: 'your_app_password_here'      // ← App password yahan likhna
    }
  });

  // Mail options (kis ko bhejna hai, kya bhejna hai)
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  // Mail bhejne ki koshish karte hain
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
};
