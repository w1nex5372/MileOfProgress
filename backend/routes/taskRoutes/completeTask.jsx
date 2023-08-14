const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const updateTaskCompletion = (pool, authenticateToken) => {
  router.put(
    "/api/completeTask/:taskId",
    authenticateToken,
    async (req, res) => {
      const { taskId } = req.params;
      const { isCompleted } = req.body;
      console.log("taskID :", taskId, "isCompleted:", isCompleted);

      try {
        // Update the `is_completed` value in the database for the specified habit ID
        await pool
          .promise()
          .query("UPDATE users_tasks SET is_completed = ? WHERE id = ?", [
            isCompleted,
            taskId,
          ]);

        res.status(200).json({
          success: true,
          message: "Task completion updated successfully.",
        });
      } catch (error) {
        console.error("Error updating task completion:", error);
        res
          .status(500)
          .json({ success: false, error: "Error updating task completion." });
      }
    }
  );

  return router;
};

module.exports = updateTaskCompletion;
