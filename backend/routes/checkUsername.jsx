const express = require("express");
const router = express.Router();

const checkUsername = (pool) => {
  router.get("/api/checkUsername/:username", (req, res) => {
    const { username } = req.params;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        return res
          .status(500)
          .json({ error: "Error connecting to the database." });
      }

      const query = "SELECT COUNT(*) AS count FROM register WHERE username = ?";

      connection.query(query, [username], (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          console.error("Error checking username:", error);
          return res.status(500).json({ error: "Error checking username." });
        }

        const count = results[0].count;
        const exists = count > 0; // Updated condition

        res.json({ exists }); // Updated response object
      });
    });
  });
  return router;
};

module.exports = checkUsername;
