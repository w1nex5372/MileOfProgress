const mysql = require("mysql2");
require("dotenv").config();
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "my_database",
  port: 3306,
  connectionLimit: 10, // Set the maximum number of connections in the pool
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    return;
  }
  console.log("Connected to MySQL database!");
  connection.release();
});

module.exports = pool;
