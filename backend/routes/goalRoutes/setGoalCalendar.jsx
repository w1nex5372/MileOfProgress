const express = require("express");
const router = express.Router();

const setCalendarDays = (pool) => {
  router.post("/api/calendarDays", async (req, res) => {
    const { userId, goalId, date, background_color } = req.body;
    console.log(userId);

    try {
      // Insert the data into the habit_tracking table
      const query =
        "INSERT INTO goal_tracking (user_id, goal_id, date, background_color) VALUES (?, ?, ?, ?)";
      await pool
        .promise()
        .query(query, [userId, goalId, date, background_color]);

      res.sendStatus(200);
    } catch (error) {
      console.error("Error inserting data into habit_tracking:", error);
      res.sendStatus(500);
    }
  });

  return router;
};

module.exports = setCalendarDays;
