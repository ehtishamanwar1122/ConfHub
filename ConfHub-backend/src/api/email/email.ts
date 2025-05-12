const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mudassiralishah555@gmail.com',  // Your Gmail address
    pass: 'mfrm qmsz yiey pgzp',   // Your Gmail password (or App Password if 2FA is enabled)
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: 'mudassiralishah555@gmail.com',    // Sender address
    to,                              // Recipient address
    subject,                         // Subject line
    text,                            // Plain text body
    html,                            // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
module.exports = sendEmail;
