const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const getUsername = (pool, authenticateToken) => {
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const userId = req.userId;

      const [results] = await pool
        .promise()
        .query("SELECT username FROM register WHERE id = ?", [userId]);

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      const username = results[0].username;

      res.status(200).json({ success: true, username });
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

module.exports = getUsername;
