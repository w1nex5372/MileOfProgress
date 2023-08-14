const express = require("express");
const router = express.Router();

const deleteHabit = (pool, authenticateToken) => {
  router.delete(
    "/api/habitas/:habitId",
    authenticateToken,
    async (req, res) => {
      const userId = req.userId;
      const habitId = req.params.habitId;

      console.log("user id:", userId, "habitId:", habitId);

      try {
        // Delete the habit from the database using the habit ID and user ID
        await pool
          .promise()
          .query("DELETE FROM users_habits WHERE id = ? AND user_id = ?", [
            habitId,
            userId,
          ]);

        res
          .status(200)
          .json({ success: true, message: "Habit deleted successfully." });
      } catch (error) {
        console.error("Error deleting habit:", error);
        res
          .status(500)
          .json({ success: false, error: "Error deleting habit." });
      }
    }
  );

  return router;
};

module.exports = deleteHabit;
