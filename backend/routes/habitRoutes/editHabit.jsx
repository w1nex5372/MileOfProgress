const express = require("express");
const router = express.Router();

const editHabit = (pool, authenticateToken) => {
  router.put("/api/habits/:habitId", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const habitId = req.params.habitId;
    const { name, description, frequency, reminder, category } = req.body;

    try {
      // Update the habit in the database using the habit ID and user ID
      await pool
        .promise()
        .query(
          "UPDATE users_habits SET name = ?, description = ?, frequency = ?, reminder = ?, category = ? WHERE id = ? AND user_id = ?",
          [name, description, frequency, reminder, category, habitId, userId]
        );

      res
        .status(200)
        .json({ success: true, message: "Habit updated successfully." });
    } catch (error) {
      console.error("Error updating habit:", error);
      res.status(500).json({ success: false, error: "Error updating habit." });
    }
  });

  return router;
};

module.exports = editHabit;
