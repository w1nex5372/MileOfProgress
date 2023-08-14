const express = require("express");
const router = express.Router();

// Assuming you have the authentication middleware function (authenticateToken) defined

const setGoals = (pool, authenticateToken) => {
  router.post("/", authenticateToken, async (req, res) => {
    const {
      name,
      description,
      frequency,
      reminder,
      category,
      fromDate,
      toDate,
    } = req.body;
    const userId = req.userId;

    try {
      // Insert the habit into the database along with the user ID
      await pool
        .promise()
        .query(
          "INSERT INTO users_goals (user_id, name, description, frequency, reminder, category, fromDate, toDate) VALUES (?, ?, ?, ?, ?, ?,?,?)",
          [
            userId,
            name,
            description,
            frequency,
            reminder,
            category,
            fromDate,
            toDate,
          ]
        );

      const goalIdResult = await pool
        .promise()
        .query("SELECT LAST_INSERT_ID() as goalId");

      const goalId = goalIdResult[0][0].goalId;

      res.status(200).json({
        success: true,
        message: "goal added successfully.",
        goalId: goalId,
      });
    } catch (error) {
      console.error("Error adding goal:", error);
      res.status(500).json({ success: false, error: "Error adding goal." });
    }
  });

  return router;
};

module.exports = setGoals;
