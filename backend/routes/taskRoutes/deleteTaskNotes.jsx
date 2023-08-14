const express = require("express");
const router = express.Router();

const deleteNote = (pool, authenticateToken) => {
  router.delete(
    "/api/deleteNote/:taskId",
    authenticateToken,
    async (req, res) => {
      const taskId = req.params.taskId;
      const userId = req.userId;

      try {
        await pool
          .promise()
          .query("DELETE FROM tasks_notes WHERE user_id = ? AND task_id = ?", [
            userId,
            taskId,
          ]);

        res.status(200).json({
          success: true,
          message: "Row deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting row:", error);
        res.status(500).json({ success: false, error: "Error deleting row." });
      }
    }
  );

  return router;
};

module.exports = deleteNote;
