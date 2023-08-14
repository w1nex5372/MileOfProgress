const express = require("express");
const router = express.Router();

const setPomodoroTotalTime = (pool, authenticateToken) => {
  router.post(
    "/api/updateTotalTimeSpent",
    authenticateToken,
    async (req, res) => {
      const { type, timeSpent } = req.body;
      const userId = req.userId;
      try {
        // Check if the user has a row in user_tasks_stats table
        const checkQuery = "SELECT * FROM user_tasks_stats WHERE user_id = ?";
        const checkResult = await pool.promise().query(checkQuery, [userId]);

        console.log("Received type:", type);
        console.log("Received timeSpent:", timeSpent);
        console.log("Received userId:", userId);

        if (checkResult[0].length === 0) {
          console.log("Inserting new row...");
          // If no row exists, insert a new row
          const insertQuery =
            "INSERT INTO user_tasks_stats (user_id, total_time_spent, longest_session) VALUES (?, ?, ?)";
          await pool
            .promise()
            .query(insertQuery, [userId, timeSpent, timeSpent]);
          console.log("Inserted new row successfully.");
        } else {
          console.log("Updating existing row...");
          // If row exists, update total_time_spent or longest_session based on the type
          const updateQuery =
            "UPDATE user_tasks_stats SET total_time_spent = total_time_spent + ?, longest_session = GREATEST(longest_session, ?) WHERE user_id = ?";
          await pool
            .promise()
            .query(updateQuery, [timeSpent, timeSpent, userId]);
          console.log("Updated existing row successfully.");
        }

        res.json({ success: true });
      } catch (error) {
        console.error("Error updating time:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    }
  );
  return router;
};

module.exports = setPomodoroTotalTime;
