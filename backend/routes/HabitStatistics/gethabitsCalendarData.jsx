const express = require("express");
const router = express.Router();

const getHabitData = (pool) => {
  router.get("/api/getHabitData", async (req, res) => {
    const { habitIds } = req.query;

    // Check if habitIds is an array
    if (!Array.isArray(habitIds)) {
      return res.status(400).json({
        success: false,
        error: "Habit IDs must be provided as an array.",
      });
    }

    try {
      let habitData = [];

      // Fetch habit data for each habit ID in the array
      const fetchHabitDataPromises = habitIds.map(async (habitId) => {
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

        habitData.push({
          habitId,
          calendarDays: queryResult,
        });
      });

      await Promise.all(fetchHabitDataPromises);

      res.status(200).json({
        success: true,
        habitData,
      });
    } catch (error) {
      console.error("Error retrieving habit data:", error);
      res.status(500).json({
        success: false,
        error: "Error retrieving habit data.",
      });
    }
  });

  return router;
};

module.exports = getHabitData;
