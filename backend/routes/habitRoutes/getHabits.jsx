const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const getHabits = (pool, authenticateToken) => {
  router.get("/", authenticateToken, async (req, res) => {
    const userId = req.userId;

    try {
      // Retrieve habits from the database for the specified user
      const queryResult = await pool
        .promise()
        .query("SELECT * FROM users_habits WHERE user_id = ?", [userId]);

      const habits = queryResult[0];

      res.status(200).json({ success: true, habits });
    } catch (error) {
      console.error("Error retrieving habits:", error);
      res
        .status(500)
        .json({ success: false, error: "Error retrieving habits." });
    }
  });

  return router;
};

module.exports = getHabits;
