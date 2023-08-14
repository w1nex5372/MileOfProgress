const express = require("express");
const router = express.Router();

const getCalendarDays = (pool) => {
  router.get("/api/getCalendarDays", async (req, res) => {
    const { habitId } = req.query;

    try {
      let calendarDays = [];

      // Retrieve data for the selected habit
      const queryResult = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM habit_tracking WHERE habit_id = ?`;
        pool.query(query, [habitId], (error, rows) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });

      calendarDays = queryResult;

      res.status(200).json({
        success: true,
        calendarDays,
      });
    } catch (error) {
      console.error("Error retrieving habit tracking data:", error);
      res.status(500).json({
        success: false,
        error: "Error retrieving habit tracking data.",
      });
    }
  });

  return router;
};

module.exports = getCalendarDays;
