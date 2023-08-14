const express = require("express");
const router = express.Router();

const getCompareCalendarDays = (pool) => {
  router.get("/api/getCompareHabitDays", async (req, res) => {
    const { compareHabitId } = req.query;
    console.log("compareHabitId:", compareHabitId);

    try {
      let compareHabitDays = [];

      // Retrieve data for the selected habit
      const queryResult = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM habit_tracking WHERE habit_id = ?`;
        console.log("Executing query:", query);
        console.log("Query parameters:", [compareHabitId]);

        pool.query(query, [compareHabitId], (error, rows) => {
          if (error) {
            console.error("Query error:", error);
            reject(error);
          } else {
            console.log("Query result:", rows);
            resolve(rows);
          }
        });
      });

      compareHabitDays = queryResult;

      res.status(200).json({
        success: true,
        compareHabitDays, // Use 'calendarDays' key instead of 'compareHabitDays'
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

module.exports = getCompareCalendarDays;
