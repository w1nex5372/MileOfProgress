const express = require("express");
const router = express.Router();

const deleteGoalHabitAssociation = (pool, authenticateToken) => {
  router.delete(
    "/api/goal/habit/:goalId/:habitId",
    authenticateToken,
    async (req, res) => {
      const userId = req.userId;
      const goalId = req.params.goalId;
      const habitId = req.params.habitId;

      console.log("user id:", userId, "goalId:", goalId, "habitId:", habitId);

      try {
        // Fetch the existing habit_ids array for the goal and user
        const [goal] = await pool
          .promise()
          .query(
            "SELECT habit_ids FROM goal_habit_association WHERE goal_id = ? AND user_id = ?",
            [goalId, userId]
          );

        // Check if the goal exists and has associated habit_ids
        if (goal && goal.length > 0) {
          let habitIdsArray = goal[0].habit_ids;
          console.log(habitIdsArray, "habitIdsArray");
          // If habit_ids is stored as a JSON string, parse it to an array
          if (typeof habitIdsArray === "string") {
            habitIdsArray = JSON.parse(habitIdsArray);
          }

          // Filter out the specified habitId from the array
          const updatedHabitIdsArray = habitIdsArray.filter(
            (id) => id !== habitId
          );

          if (updatedHabitIdsArray.length === 0) {
            // If there are no habit_ids left, delete the entire row
            await pool
              .promise()
              .query(
                "DELETE FROM goal_habit_association WHERE goal_id = ? AND user_id = ?",
                [goalId, userId]
              );
          } else {
            // Update the habit_ids column with the updated array
            await pool
              .promise()
              .query(
                "UPDATE goal_habit_association SET habit_ids = ? WHERE goal_id = ? AND user_id = ?",
                [JSON.stringify(updatedHabitIdsArray), goalId, userId]
              );
          }
        }

        res.status(200).json({
          success: true,
          message: "Habit association removed from the goal successfully.",
        });
      } catch (error) {
        console.error("Error removing habit association:", error);
        res
          .status(500)
          .json({ success: false, error: "Error removing habit association." });
      }
    }
  );

  return router;
};

module.exports = deleteGoalHabitAssociation;
