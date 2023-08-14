// Import necessary modules
const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined
const getNotes = (pool, authenticateToken) => {
  router.get("/api/getNotes/:taskId", authenticateToken, async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.userId;

    try {
      const [notes] = await pool
        .promise()
        .query("SELECT * FROM tasks_notes WHERE user_id = ? AND task_id = ?", [
          userId,
          taskId,
        ]);

      res.status(200).json({
        success: true,
        notes,
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ success: false, error: "Error fetching notes." });
    }
  });

  return router;
};

module.exports = getNotes;
