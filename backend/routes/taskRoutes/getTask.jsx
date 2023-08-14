const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const getTasks = (pool, authenticateToken) => {
  router.get("/", authenticateToken, async (req, res) => {
    const userId = req.userId;

    try {
      // Retrieve habits from the database for the specified user
      const queryResult = await pool
        .promise()
        .query("SELECT * FROM users_tasks WHERE user_id = ?", [userId]);

      const tasks = queryResult[0];

      res.status(200).json({ success: true, tasks });
    } catch (error) {
      console.error("Error retrieving tasks:", error);
      res
        .status(500)
        .json({ success: false, error: "Error retrieving tasks." });
    }
  });

  return router;
};

module.exports = getTasks;
