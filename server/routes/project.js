const express = require("express");
const router = express.Router();

const {
  postProject,
  getAllProjects,
  getClientProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

// Create new project
router.post("/", postProject);

// Get all open projects (freelancer/public)
router.get("/", getAllProjects);

// Get all projects posted by a specific client
router.get("/my-project/:clientId", getClientProjects);

// Update a project
router.put("/:projectId", updateProject);

// Delete a project
router.delete("/:projectId", deleteProject);

module.exports = router;
