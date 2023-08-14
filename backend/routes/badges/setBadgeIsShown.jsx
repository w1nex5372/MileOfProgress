const express = require("express");
const router = express.Router();

const updateBadgeIsShown = (pool, authenticateToken) => {
  router.post(
    "/api/updateBadgeIsShown",
    authenticateToken,
    async (req, res) => {
      const { badge_id, is_shown } = req.body;
      console.log(badge_id);
      try {
        // Update the 'is_shown' property of the badge in the 'earned_badges' table
        const updateQuery = `UPDATE earned_badges
                           SET is_shown = ?
                           WHERE badge_id = ?`;

        await pool.promise().query(updateQuery, [is_shown, badge_id]);

        res.status(200).json({
          success: true,
          message: "Badge is_shown updated successfully.",
        });
      } catch (error) {
        console.error("Error updating badge is_shown:", error);
        res
          .status(500)
          .json({ success: false, error: "Failed to update badge is_shown." });
      }
    }
  );

  return router;
};

module.exports = updateBadgeIsShown;
