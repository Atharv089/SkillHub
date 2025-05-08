const mysql = require("mysql");

// Replace with your actual database credentials
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // your MySQL username
  password: "Atharv@amd08",       // your MySQL password
  database: "skillhub" // your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL as ID", db.threadId);
});

module.exports = db;
