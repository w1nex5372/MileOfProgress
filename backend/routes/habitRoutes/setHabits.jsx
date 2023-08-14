const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const setHabits = (pool, authenticateToken) => {
  router.post("/", authenticateToken, async (req, res) => {
    const { name, description, frequency, reminder, category } = req.body;
    const userId = req.userId;

    try {
      // Insert the habit into the database along with the user ID
      await pool
        .promise()
        .query(
          "INSERT INTO users_habits (user_id, name, description, frequency, reminder, category) VALUES (?, ?, ?, ?, ?, ?)",
          [userId, name, description, frequency, reminder, category]
        );

      const habitIdResult = await pool
        .promise()
        .query("SELECT LAST_INSERT_ID() as habitId");

      const habitId = habitIdResult[0][0].habitId;

      res.status(200).json({
        success: true,
        message: "Habit added successfully.",
        habitId: habitId,
      });
    } catch (error) {
      console.error("Error adding habit:", error);
      res.status(500).json({ success: false, error: "Error adding habit." });
    }
  });

  return router;
};

module.exports = setHabits;
