const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const proposalRoutes = require('./routes/proposal');
const messageRoutes = require('./routes/message');

const app = express();

// CORS config
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cors({ origin: "http://127.0.0.1:5500", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Atharv@amd08",
  database: "skillhub"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

// Make db available globally
app.set("db", db);

// ✅ Mount routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/proposals", proposalRoutes);
app.use("/messages", messageRoutes);

// ✅ Start the server (only once!)
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
