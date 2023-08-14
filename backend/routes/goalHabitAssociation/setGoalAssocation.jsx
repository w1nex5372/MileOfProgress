// routes/setGoalAssociation.js
const express = require("express");
const router = express.Router();

const setGoalHabitAssociate = (pool) => {
  router.post("/api/setGoalAssociate", async (req, res) => {
    const { userId, goalId, habitIds } = req.body;

    try {
      // Convert the habitIds array to JSON format if it's not already a JSON string
      const habitIdsJson = Array.isArray(habitIds)
        ? JSON.stringify(habitIds)
        : habitIds;
      console.log(habitIdsJson);
      // Insert new associations for the goal along with the habitIds JSON data
      await pool
        .promise()
        .query(
          "INSERT INTO goal_habit_association (user_id, goal_id, habit_ids) VALUES (?, ?, ?)",
          [userId, goalId, habitIdsJson]
        );

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error setting goal-habit association:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  return router;
};

module.exports = setGoalHabitAssociate;
