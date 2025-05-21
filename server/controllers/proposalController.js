const db = require("../db");
exports.submitProposal = (req, res) => {
  const { project_id, freelancer_id, pitch, timeline, quote } = req.body;
  const sql = "INSERT INTO proposals (project_id, freelancer_id, pitch, timeline, quote) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [project_id, freelancer_id, pitch, timeline, quote], (err) => {
    if (err) return res.status(500).json({ message: "Proposal failed" });
    res.json({ message: "Proposal submitted successfully" });
  });
};

// Accept a proposal and reject others for the same project
exports.acceptProposal = (req, res) => {
  const { proposalId, projectId } = req.body;
  const db = req.app.get("db");

  // Reject other proposals for the same project
  const rejectOthers = `UPDATE proposals SET status = 'rejected' WHERE project_id = ? AND id != ?`;
  db.query(rejectOthers, [projectId, proposalId], (err) => {
    if (err) {
      console.error("Error rejecting other proposals:", err);
      console.log("Proposal Accept API hit:", req.body);
      return res.status(500).json({ success: false, message: "Failed to reject other proposals." });
    }

    // Accept the selected proposal
    const acceptQuery = `UPDATE proposals SET status = 'accepted' WHERE id = ?`;
    db.query(acceptQuery, [proposalId], (err2) => {
      if (err2) {
        console.error("Error accepting proposal:", err2);
        return res.status(500).json({ success: false, message: "Failed to accept proposal." });
      }

      res.json({ success: true, message: "Proposal accepted successfully." });
    });
  });
};
