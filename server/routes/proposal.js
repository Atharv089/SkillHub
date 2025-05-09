const express = require("express");
const router = express.Router();
const db = require("../db");

// Submit proposal
router.post("/", (req, res) => {
  const { pitch, quote, timeline, project_id, freelancer_id } = req.body;
  if (!pitch || !quote || !timeline || !project_id || !freelancer_id) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = `
    INSERT INTO proposals (pitch, quote, timeline, project_id, freelancer_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [pitch, quote, timeline, project_id, freelancer_id], (err, result) => {
    if (err) {
      console.error("Proposal insert error:", err);
      return res.status(500).json({ message: "Failed to submit proposal" });
    }
    res.json({ message: "Proposal submitted", proposalId: result.insertId });
  });
});

// GET proposals by project
router.get("/by-project/:projectId", (req, res) => {
  const { projectId } = req.params;

  const sql = `
    SELECT p.*, u.name as freelancer_name
    FROM proposals p
    JOIN users u ON p.freelancer_id = u.id
    WHERE p.project_id = ?
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error("Proposal fetch error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, proposals: results });
  });
});


//freelancer
router.get("/my/:freelancerId", (req, res) => {
  const freelancerId = req.params.freelancerId;

  const sql = `
    SELECT p.*, pr.title as project_title, u.name as client_name
    FROM proposals p
    JOIN projects pr ON p.project_id = pr.id
    JOIN users u ON pr.client_id = u.id
    WHERE p.freelancer_id = ?
  `;

  db.query(sql, [freelancerId], (err, results) => {
    if (err) {
      console.error("Error fetching freelancer proposals:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    res.json({ success: true, proposals: results });
  });
});


module.exports = router;
