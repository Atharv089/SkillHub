const db = require("../db");
exports.submitProposal = (req, res) => {
  const { project_id, freelancer_id, pitch, timeline, quote } = req.body;
  const sql = "INSERT INTO proposals (project_id, freelancer_id, pitch, timeline, quote) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [project_id, freelancer_id, pitch, timeline, quote], (err) => {
    if (err) return res.status(500).json({ message: "Proposal failed" });
    res.json({ message: "Proposal submitted successfully" });
  });
};