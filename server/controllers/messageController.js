const db = require("../db");
exports.sendMessage = (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  const sql = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
  db.query(sql, [sender_id, receiver_id, content], (err) => {
    if (err) return res.status(500).json({ message: "Message failed" });
    res.json({ message: "Message sent" });
  });
};
exports.getMessages = (req, res) => {
  const { conversationId } = req.params;
  const sql = "SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at";
  db.query(sql, [conversationId, conversationId], (err, results) => {
    if (err) return res.status(500).json({ message: "Message fetch failed" });
    res.json(results);
  });
};