const express = require("express");
const router = express.Router();

const deleteTask = (pool, authenticateToken) => {
  router.delete("/api/taskas/:taskId", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const taskId = req.params.taskId;

    console.log("user id:", userId, "habitId:", taskId);

    try {
      // Delete the habit from the database using the habit ID and user ID
      await pool
        .promise()
        .query("DELETE FROM users_tasks WHERE id = ? AND user_id = ?", [
          taskId,
          userId,
        ]);

      res
        .status(200)
        .json({ success: true, message: "task deleted successfully." });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ success: false, error: "Error deleting habit." });
    }
  });

  return router;
};

module.exports = deleteTask;
