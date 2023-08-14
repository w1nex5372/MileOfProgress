const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const updateGoalCompletion = (pool, authenticateToken) => {
  router.put(
    "/api/completedGoal/:goalId",
    authenticateToken,
    async (req, res) => {
      const { goalId } = req.params;
      const { isCompleted } = req.body;
      console.log(goalId, isCompleted);

      try {
        // Update the `is_completed` value in the database for the specified habit ID
        await pool
          .promise()
          .query("UPDATE users_goals SET is_completed = ? WHERE id = ?", [
            isCompleted,
            goalId,
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

module.exports = updateGoalCompletion;
