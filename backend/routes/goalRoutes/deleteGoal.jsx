const express = require("express");
const router = express.Router();

const deleteGoal = (pool, authenticateToken) => {
  router.delete("/api/goalas/:goalId", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const goalId = req.params.goalId;

    console.log("user id:", userId, "goalId:", goalId);

    try {
      // Delete the habit from the database using the habit ID and user ID
      await pool
        .promise()
        .query("DELETE FROM users_goals WHERE id = ? AND user_id = ?", [
          goalId,
          userId,
        ]);

      res
        .status(200)
        .json({ success: true, message: "goal deleted successfully." });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ success: false, error: "Error deleting goal." });
    }
  });

  return router;
};

module.exports = deleteGoal;
