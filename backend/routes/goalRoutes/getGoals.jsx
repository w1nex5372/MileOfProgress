const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const getGoals = (pool, authenticateToken) => {
  router.get("/", authenticateToken, async (req, res) => {
    const userId = req.userId;

    try {
      // Retrieve habits from the database for the specified user
      const queryResult = await pool
        .promise()
        .query("SELECT * FROM users_goals WHERE user_id = ?", [userId]);

      const goals = queryResult[0];

      res.status(200).json({ success: true, goals });
    } catch (error) {
      console.error("Error retrieving goals:", error);
      res
        .status(500)
        .json({ success: false, error: "Error retrieving goals." });
    }
  });

  return router;
};

module.exports = getGoals;
