const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Import the jwt module here

const handleNewPassword = (pool, authenticateToken) => {
  const secretKey = "lukas"; // Define your secret key here

  // API endpoint for setting a new password
  router.post("/api/newPassword", authenticateToken, async (req, res) => {
    const { newPassword } = req.body;

    try {
      const decodedToken = jwt.verify(req.token, secretKey);

      const email = decodedToken.email;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Use the promise-based query method
      const updateUserQuery =
        "UPDATE register SET password = ? WHERE email = ?";
      await pool.execute(updateUserQuery, [hashedPassword, email]);

      const newToken = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

      res.json({
        success: true,
        message: "Password updated successfully.",
        token: newToken,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  });

  return router;
};

module.exports = handleNewPassword;
