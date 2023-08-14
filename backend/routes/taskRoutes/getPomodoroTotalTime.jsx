const express = require("express");
const router = express.Router();

const getPomodoroTotalTime = (pool, authenticateToken) => {
  router.get("/api/getTotalTimeSpent", authenticateToken, async (req, res) => {
    const userId = req.userId;
    try {
      const query =
        "SELECT total_time_spent, longest_session FROM user_tasks_stats WHERE user_id = ?";
      const result = await pool.promise().query(query, [userId]);

      if (result[0].length > 0) {
        const totalTimeSpent = result[0][0].total_time_spent;
        const longestSession = result[0][0].longest_session;
        res.json({ success: true, totalTimeSpent, longestSession });
      } else {
        res.json({ success: true, totalTimeSpent: 0, longestSession: 0 });
      }
    } catch (error) {
      console.error("Error retrieving total time spent:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });
  return router;
};

module.exports = getPomodoroTotalTime;
