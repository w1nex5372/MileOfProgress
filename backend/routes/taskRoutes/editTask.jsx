const express = require("express");
const router = express.Router();

const editTask = (pool, authenticateToken) => {
  router.put("/api/EditTask/:taskId", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const taskId = req.params.taskId;
    const {
      name,
      toDate,
      fromDate,
      description,
      priority,

      category,
    } = req.body;

    try {
      // Update the habit in the database using the habit ID and user ID
      await pool
        .promise()
        .query(
          "UPDATE users_tasks SET name = ?, description = ?, priority = ?,fromDate = ?, toDate = ?,category = ? WHERE id = ? AND user_id = ?",
          [
            name,
            description,
            priority,
            fromDate,
            toDate,
            category,
            taskId,
            userId,
          ]
        );

      res
        .status(200)
        .json({ success: true, message: "Task updated successfully." });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ success: false, error: "Error updating task." });
    }
  });

  return router;
};

module.exports = editTask;
