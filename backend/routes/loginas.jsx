const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Function to generate a token (placeholder)
function generateToken(userId) {
  const secret = "lukas"; // Replace this with a secret key of your choice
  const expirationTime = Math.floor(Date.now() / 1000) + 3 * 60 * 60 * 1000; // Set expiration time to 3 hours from now (3 hours * 60 minutes * 60 seconds * 1000 milliseconds)

  const token = jwt.sign({ userId, exp: expirationTime }, secret);
  return token;
}
const loginas = (pool) => {
  router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
      const [results] = await pool
        .promise()
        .query("SELECT * FROM register WHERE email = ?", [email]);

      if (results.length === 0) {
        return res.status(401).json({ error: "Incorrect email or password." });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Incorrect email or password." });
      }

      // Generate a token or session to indicate that the user is authenticated
      const token = generateToken(user.id);

      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "Error querying the database.",
      });
    }
  });

  return router;
};

module.exports = loginas;
