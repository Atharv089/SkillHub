const db = require("../db");

// ✅ POST - Add a new project
const postProject = (req, res) => {
  const { title, description, skills, budget, deadline, client_id } = req.body;

  if (!title || !description || !skills || !budget || !deadline || !client_id) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const query = `INSERT INTO projects (title, description, skills, budget, deadline, client_id) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [title, description, skills, budget, deadline, client_id], (err) => {
    if (err) {
      console.error("Error inserting project:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(201).json({ success: true, message: "Project posted successfully" });
  });
};

// ✅ GET - All open projects (for freelancers)
const getAllProjects = (req, res) => {
  const sql = 'SELECT * FROM projects WHERE status = "Open" OR status IS NULL'; // fallback if no status column
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all projects:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true, projects: results });
  });
};

// ✅ GET - Projects by a specific client
const getClientProjects = (req, res) => {
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

// ✅ PUT - Update a project
const updateProject = (req, res) => {
  const { projectId } = req.params;
  const { title, description, skills, budget, deadline } = req.body;

  const sql = `
    UPDATE projects SET title = ?, description = ?, skills = ?, budget = ?, deadline = ?
    WHERE id = ?
  `;
  db.query(sql, [title, description, skills, budget, deadline, projectId], (err) => {
    if (err) {
      console.error("Error updating project:", err);
      return res.status(500).json({ success: false, message: "Update failed" });
    }
    res.json({ success: true, message: "Project updated" });
  });
};

// ✅ DELETE - Delete a project
const deleteProject = (req, res) => {
  const { projectId } = req.params;
  const sql = "DELETE FROM projects WHERE id = ?";
  db.query(sql, [projectId], (err) => {
    if (err) {
      console.error("Error deleting project:", err);
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
    res.json({ success: true, message: "Project deleted" });
  });
};

// ✅ Export everything once
module.exports = {
  postProject,
  getAllProjects,
  getClientProjects,
  updateProject,
  deleteProject
};
