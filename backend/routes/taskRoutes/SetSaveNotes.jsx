const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const setNotes = (pool, authenticateToken) => {
  router.post("/api/saveNote/:taskId", authenticateToken, async (req, res) => {
    const taskId = req.params.taskId;
    const { noteContent } = req.body;
    const userId = req.userId;
    try {
      // Insert or update the note content in the database for the given task ID
      await pool
        .promise()
        .query(
          "INSERT INTO tasks_notes (user_id, task_id, note_content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE note_content = VALUES(note_content)",
          [userId, taskId, noteContent]
        );

      res.status(200).json({
        success: true,
        message: "Note saved successfully.",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      res.status(500).json({ success: false, error: "Error saving note." });
    }
  });

  return router;
};

module.exports = setNotes;
