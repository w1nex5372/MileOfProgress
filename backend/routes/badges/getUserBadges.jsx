const express = require("express");
const router = express.Router();

const getBadges = (pool, authenticateToken) => {
  router.get("/api/getBadges/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params; // Get the userId from the authenticated request

    try {
      // Query the database to retrieve the user's badges
      const [badges] = await pool
        .promise()
        .query("SELECT * FROM earned_badges WHERE user_id = ?", [userId]);

      res.status(200).json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch badges." });
    }
  });

  return router;
};

module.exports = getBadges;
