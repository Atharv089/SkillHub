const express = require("express");
const router = express.Router();
const {
  postProject,
  getAllProjects,
  getClientProjects
} = require("../controllers/projectController");

const projectController = require('../controllers/projectController');


// Route to post a new project
router.post("/", postProject);

// Route to get all projects (generic)
router.get("/", getAllProjects);

// Route to get projects posted by a specific client
router.get("/my-project/:clientId", getClientProjects);

module.exports = router;


// GET all projects for freelancers
router.get('/', projectController.getAllProjects);

