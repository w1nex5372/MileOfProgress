const express = require("express");
const router = express.Router();

const setUserBadges = (pool, authenticateToken) => {
  router.post("/api/setUserBadges", authenticateToken, async (req, res) => {
    const { userId, badges } = req.body;

    try {
      // Check if the user already has badges assigned (you can do this by querying the database)
      // For simplicity, let's assume we have a 'earned_badges' table that stores the user_id and badge_id
      const [existingBadges] = await pool
        .promise()
        .query("SELECT * FROM earned_badges WHERE user_id = ?", [userId]);

      // If the user doesn't have badges assigned, insert the new badges into the 'badges_assigned' table
      if (existingBadges.length === 0) {
        await Promise.all(
          badges.map(async (badge) => {
            const query = `INSERT INTO earned_badges (user_id, badge_name, badge_image_path, message, is_shown, threshold) 
                           VALUES (?, ?, ?, ?, ?, ?)
                           ON DUPLICATE KEY UPDATE 
                           badge_name = VALUES(badge_name),
                           badge_image_path = VALUES(badge_image_path),
                           message = VALUES(message),
                           is_shown = VALUES(is_shown),
                           threshold = VALUES(threshold)`;
            await pool.promise().query(query, [
              userId,
              badge.name,
              badge.imagePath,
              badge.message,
              false, // Set is_shown to true when inserting/updating the badge
              badge.threshold,
            ]);
          })
        );
      }

      res
        .status(200)
        .json({ success: true, message: "Badges set successfully." });
    } catch (error) {
      console.error("Error setting badges:", error);
      res.status(500).json({ success: false, error: "Failed to set badges." });
    }
  });

  return router;
};

module.exports = setUserBadges;
