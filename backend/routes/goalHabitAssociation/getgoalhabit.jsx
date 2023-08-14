// routes/getAssociatedHabits.js
const express = require("express");
const router = express.Router();

const getAssociatedHabits = (pool) => {
  router.get("/api/getGoalAssociation/:goalId", async (req, res) => {
    const goalId = req.params.goalId;
    try {
      const result = await pool
        .promise()
        .query("SELECT * FROM goal_habit_association WHERE goal_id = ?", [
          goalId,
        ]);

      if (result[0].length > 0) {
        // Assuming only one row per goal_id, so the first row is taken
        const associatedHabitsRow = result[0][0];
        let associatedHabits = [];

        if (associatedHabitsRow.habit_ids) {
          try {
            console.log("habit_ids value:", associatedHabitsRow.habit_ids);
            // Since habit_ids is already an array, assign it directly
            associatedHabits = associatedHabitsRow.habit_ids;
          } catch (parseError) {
            console.error("Error parsing habit_ids JSON:", parseError);
            return res
              .status(500)
              .json({ success: false, error: "Error parsing habit_ids JSON" });
          }
        }

        res.status(200).json({ success: true, associatedHabits });
      } else {
        res.status(200).json({ success: true, associatedHabits: [] });
      }
    } catch (error) {
      console.error("Error fetching associated habits:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  return router;
};

module.exports = getAssociatedHabits;
