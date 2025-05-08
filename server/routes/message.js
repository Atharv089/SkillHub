const express = require('express');
const router = express.Router();
const db = require('../db'); // Your MySQL connection

// Send message route
router.post('/send', (req, res) => {
  const { senderId, receiverId, content } = req.body;
  
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
  
  db.query(query, [senderId, receiverId, content], (err, result) => {
    if (err) {
      console.error("❌ Error sending message:", err);
      return res.status(500).json({ message: 'Error sending message' });
    }

    res.json({ message: 'Message sent successfully', messageId: result.insertId });
  });
});

module.exports = router;
