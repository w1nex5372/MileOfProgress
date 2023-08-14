const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const register = (pool, secretKey) => {
  router.post("/", (req, res) => {
    const { username, email, password, interests } = req.body;

    // Check if the email already exists in the database
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        res.status(500).json({
          success: false,
          error: "Failed to get database connection",
        });
        return;
      }

      connection.query(
        "SELECT * FROM register WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            console.error("Error querying the database:", err);
            res.status(500).json({
              success: false,
              error: "Failed to query the database",
            });
            return;
          }

          if (results.length > 0) {
            console.log("Email is already taken. Please choose another email.");

            // Email already exists in the database
            res.status(400).json({
              success: false,
              error: "Email is already taken. Please choose another email.",
            });
          } else {
            // Email is available, proceed with registration

            // Hash the password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) {
                console.error("Error hashing password:", err);
                res
                  .status(500)
                  .json({ success: false, error: "Failed to hash password" });
                return;
              }

              // Generate token
              const token = jwt.sign({ username, email }, secretKey);

              // Insert user data into the database
              connection.query(
                "INSERT INTO register (username, email, password, token) VALUES (?, ?, ?, ?)",
                [username, email, hashedPassword, token],
                (err, results) => {
                  if (err) {
                    console.error(
                      "Error inserting data into the database:",
                      err
                    );
                    res
                      .status(500)
                      .json({ success: false, error: "Failed to store data" });
                    return;
                  }

                  const userId = results.insertId;

                  // Insert interests into user_interests table
                  if (interests && interests.length > 0) {
                    const interestValues = interests.map((interest) => [
                      userId,
                      interest,
                    ]);

                    connection.query(
                      "INSERT INTO user_interests (user_id, interest) VALUES ?",
                      [interestValues],
                      (err, interestResults) => {
                        if (err) {
                          console.error(
                            "Error inserting interests into the database:",
                            err
                          );
                          res.status(500).json({
                            success: false,
                            error: "Failed to store interests",
                          });
                          return;
                        }

                        console.log(interestResults);
                        res.json({ success: true, data: results });
                      }
                    );
                  } else {
                    console.log(results);
                    res.json({ success: true, data: results });
                  }
                }
              );
            });
          }
        }
      );
    });
  });

  return router;
};

module.exports = register;
