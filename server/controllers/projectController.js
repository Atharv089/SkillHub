const db = require("../db");

// Controller to post a new project
const postProject = (req, res) => {
  const { title, description, skills, budget, deadline, client_id } = req.body;

  if (!title || !description || !skills || !budget || !deadline || !client_id) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const query = `INSERT INTO projects (title, description, skills, budget, deadline, client_id) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [title, description, skills, budget, deadline, client_id], (err, result) => {
    if (err) {
      console.error("Error inserting project:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(201).json({ success: true, message: "Project posted successfully" });
  });
};

// Controller to get all projects (used for freelancers or general browsing)
const getAllProjects = (req, res) => {
  const query = "SELECT * FROM projects";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({ success: true, projects: results });
  });
};

// Controller to get all projects of a specific client
const getClientProjects = (req, res) => {
  const { clientId } = req.params;

  const query = `SELECT * FROM projects WHERE client_id = ?`;

  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching client projects:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({ success: true, projects: results });
  });
};



// GET all projects (visible to freelancers)
exports.getAllProjects = (req, res) => {
  const sql = 'SELECT * FROM projects WHERE status = "Open"';

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all projects:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true, projects: results });
  });
};

// GET projects by a specific client
exports.getProjectsByClient = (req, res) => {
  const clientId = req.params.clientId;
  const sql = 'SELECT * FROM projects WHERE client_id = ?';

  db.query(sql, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching client projects:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true, projects: results });
  });
};


module.exports = {
  postProject,
  getAllProjects,
  getClientProjects
};
