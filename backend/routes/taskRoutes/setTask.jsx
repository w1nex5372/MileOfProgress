const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const setTasks = (pool, authenticateToken) => {
  router.post("/", authenticateToken, async (req, res) => {
    const { name, priority, fromDate, toDate, category, description } =
      req.body;
    const userId = req.userId;

    try {
      // Insert the task into the database along with the user ID
      await pool
        .promise()
        .query(
          "INSERT INTO users_tasks (user_id, name, description, priority, fromDate, toDate, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [userId, name, description, priority, fromDate, toDate, category]
        );

      const taskIdResult = await pool
        .promise()
        .query("SELECT LAST_INSERT_ID() as taskId");
      const taskId = taskIdResult[0][0].taskId;

      res.status(200).json({
        success: true,
        message: "Task added successfully.",
        taskId: taskId,
      });
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).json({ success: false, error: "Error adding task." });
    }
  });

  return router;
};

module.exports = setTasks;
