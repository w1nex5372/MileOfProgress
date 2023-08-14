const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const updateHabitCompletion = (pool, authenticateToken) => {
  router.put(
    "/api/completeHabit/:habitId",
    authenticateToken,
    async (req, res) => {
      const { habitId } = req.params;
      const { isCompleted } = req.body;
      console.log(habitId, isCompleted);

      try {
        // Update the `is_completed` value in the database for the specified habit ID
        await pool
          .promise()
          .query("UPDATE users_habits SET is_completed = ? WHERE id = ?", [
            isCompleted,
            habitId,
          ]);

        res.status(200).json({
          success: true,
          message: "Habit completion updated successfully.",
        });
      } catch (error) {
        console.error("Error updating habit completion:", error);
        res
          .status(500)
          .json({ success: false, error: "Error updating habit completion." });
      }
    }
  );

  return router;
};

module.exports = updateHabitCompletion;
