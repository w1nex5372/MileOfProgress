const express = require("express");
const router = express.Router();

const setCalendarDays = (pool) => {
  router.post("/api/calendarDays", async (req, res) => {
    const { userId, habitId, goalId, date, background_color } = req.body;

    try {
      let tableName;
      let idColumnName;

      if (habitId) {
        tableName = "habit_tracking";
        idColumnName = "habit_id";
      } else if (goalId) {
        tableName = "goal_tracking";
        idColumnName = "goal_id";
      } else {
        console.error("No habitId or goalId provided");
        return res.sendStatus(400);
      }

      const query = `INSERT INTO ${tableName} (user_id, ${idColumnName}, date, background_color) VALUES (?, ?, ?, ?)`;
      await pool
        .promise()
        .query(query, [userId, habitId || goalId, date, background_color]);

      res.sendStatus(200);
    } catch (error) {
      console.error("Error inserting data:", error);
      res.sendStatus(500);
    }
  });

  router.get("/api/getCalendarDays", async (req, res) => {
    const { habitId, goalId } = req.query;

    try {
      let tableName;
      let idColumnName;

      if (habitId) {
        tableName = "habit_tracking";
        idColumnName = "habit_id";
      } else if (goalId) {
        tableName = "goal_tracking";
        idColumnName = "goal_id";
      } else {
        console.error("No habitId or goalId provided");
        return res.sendStatus(400);
      }

      const query = `SELECT * FROM ${tableName} WHERE ${idColumnName} = ?`;
      const [rows] = await pool.promise().query(query, [habitId || goalId]);
      res.json({ calendarDays: rows });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.sendStatus(500);
    }
  });

  return router;
};

module.exports = setCalendarDays;
