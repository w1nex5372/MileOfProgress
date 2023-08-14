const express = require("express");
const router = express.Router();

const getHabitsData = (pool) => {
  router.get("/api/getHabitsData", async (req, res) => {
    const { habitIds } = req.query;

    try {
      // Parse the habit IDs from the query parameter (assuming habitIds is a comma-separated string of IDs)
      const habitIdsArray = habitIds.split(",").map(Number);

      // Fetch habit data from the database based on habit IDs
      const result = await pool
        .promise()
        .query("SELECT * FROM users_habits WHERE id IN (?)", [habitIdsArray]);

      // If habits are found, send the data as a response
      if (result[0].length > 0) {
        const habitsData = result[0];
        res.status(200).json(habitsData);
      } else {
        // If no habits are found, send an empty array as the response
        res.status(200).json([]);
      }
    } catch (error) {
      console.error("Error fetching habit data:", error);
      res.status(500).json({ error: "Error fetching habit data" });
    }
  });

  return router;
};

module.exports = getHabitsData;
