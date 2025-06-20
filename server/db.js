// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection when pool is created
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database successfully!");
    connection.release(); // release connection back to the pool
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

module.exports = pool;
