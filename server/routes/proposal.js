const express = require("express");
const router = express.Router();
const db = require("../db");  // Assuming you export the db connection in a separate file

// POST route to submit a proposal
router.post("/", (req, res) => {
  const { pitch, quote, timeline, project_id, freelancer_id } = req.body;

  if (!pitch || !quote || !timeline || !project_id || !freelancer_id) {
    return res.status(400).json({ message: "❗ Missing required fields." });
  }

  // SQL query to insert the proposal
  const query = `
    INSERT INTO proposals (project_id, freelancer_id, pitch, quote, timeline)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [project_id, freelancer_id, pitch, quote, timeline], (err, result) => {
    if (err) {
      console.error("Error inserting proposal:", err);
      return res.status(500).json({ message: "❌ Could not submit proposal." });
    }

    // Respond with success
    res.status(201).json({ message: "✅ Proposal submitted successfully." });
  });
});

module.exports = router;
