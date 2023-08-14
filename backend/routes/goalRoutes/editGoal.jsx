const express = require("express");
const router = express.Router();

const editGoal = (pool, authenticateToken) => {
  router.put("/api/goals/:goalId", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const goalId = req.params.goalId; // Corrected parameter name
    const { name, description, frequency, reminder, category } = req.body;

    try {
      // Update the goal in the database using the goal ID and user ID
      await pool
        .promise()
        .query(
          "UPDATE users_goals SET name = ?, description = ?, frequency = ?, reminder = ?, category = ? WHERE id = ? AND user_id = ?",
          [name, description, frequency, reminder, category, goalId, userId]
        );

      res
        .status(200)
        .json({ success: true, message: "Goal updated successfully." });
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ success: false, error: "Error updating goal." });
    }
  });

  return router;
};

module.exports = editGoal;
