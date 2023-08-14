const express = require("express");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const router = express.Router();
const pool = require("../database/database.jsx"); // Import your database connection pool module

sgMail.setApiKey(
  "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"
);

const secretKey = "lukas"; // Replace with your actual secret key

// API endpoint for initiating password reset
router.post("/api/resetPasswordRequest", async (req, res) => {
  const { email } = req.body;

  // Generate a reset token
  const resetToken = jwt.sign({ email }, secretKey, { expiresIn: "15min" });

  try {
    // Update the user's token in the database
    await pool
      .promise()
      .query("UPDATE register SET token = ? WHERE email = ?", [
        resetToken,
        email,
      ]);

    // Send password reset email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const emailText = `Click the link below to reset your password: ${resetLink}`;
    sendEmail(email, "Password Reset", emailText);

    res.json({ success: true, message: "Password reset link sent." });
  } catch (error) {
    console.error("Error updating token:", error);
    res.status(500).json({ success: false, error: "Error updating token." });
  }
});

// Send email function using SendGrid
const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: "mileofprogress@gmail.com", // Replace with your email address
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = router;
