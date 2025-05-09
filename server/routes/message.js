const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Send a message
router.post("/send", (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
  db.query(query, [sender_id, receiver_id, content], (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ message: "Error sending message" });
    }
    res.json({ message: "Message sent successfully", messageId: result.insertId });
  });
});

// ✅ Inbox for a user
router.get("/inbox/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT DISTINCT u.id, u.name
    FROM users u
    JOIN messages m ON u.id = m.sender_id OR u.id = m.receiver_id
    WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?
  `;
  db.query(sql, [userId, userId, userId], (err, result) => {
    if (err) {
      console.error("❌ Inbox fetch error:", err);
      return res.status(500).json({ message: "Inbox fetch error" });
    }
    res.json(result);
  });
});

// ✅ Get conversation thread between two users
router.get("/thread/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;
  const sql = `
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at
  `;
  db.query(sql, [user1, user2, user2, user1], (err, result) => {
    if (err) {
      console.error("❌ Thread fetch error:", err);
      return res.status(500).json({ message: "Thread fetch error" });
    }
    res.json(result);
  });
});

module.exports = router;
