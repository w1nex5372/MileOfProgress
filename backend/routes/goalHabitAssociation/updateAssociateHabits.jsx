// routes/updateGoalHabitAssociation.js
const express = require("express");
const router = express.Router();

const updateGoalHabitAssociation = (pool, authenticateToken) => {
  router.put(
    "/api/updateGoalHabitAssociation/:goalId",
    authenticateToken,
    async (req, res) => {
      const { goalId } = req.params;
      const { habitIds } = req.body;
      const userId = req.userId; // Extract userId from the authenticated user

      try {
        // Convert the habitIds array to JSON format if it's not already a JSON string
        const habitIdsJson = Array.isArray(habitIds)
          ? JSON.stringify(habitIds)
          : habitIds;
        console.log(habitIdsJson);

        // Check if a row with the specified goal_id exists
        const [existingGoal] = await pool
          .promise()
          .query("SELECT * FROM goal_habit_association WHERE goal_id = ?", [
            goalId,
          ]);

        if (existingGoal && existingGoal.length > 0) {
          // If the row exists, update the habit_ids column
          await pool
            .promise()
            .query(
              "UPDATE goal_habit_association SET habit_ids = ? WHERE goal_id = ?",
              [habitIdsJson, goalId]
            );
        } else {
          // If the row does not exist, create a new one
          await pool
            .promise()
            .query(
              "INSERT INTO goal_habit_association (goal_id, user_id, habit_ids) VALUES (?, ?, ?)",
              [goalId, userId, habitIdsJson]
            );
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error updating goal-habit association:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    }
  );

  return router;
};

module.exports = updateGoalHabitAssociation;
