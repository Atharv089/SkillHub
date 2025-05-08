const API_URL = "http://127.0.0.1:4000"; // Make sure your backend is running here!

// ===== REGISTER FUNCTION =====
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.onsubmit = async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
      return alert("❗ Please fill in all fields.");
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        window.location.href = "login.html";
      } else {
        alert("❌ " + (data.message || "Registration failed."));
      }
    } catch (err) {
      console.error("Registration Error:", err);
      alert("❌ Could not connect to server.");
    }
  };
}

// ===== LOGIN FUNCTION =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      return alert("❗ Please enter email and password.");
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("username", data.user.name);

        alert("✅ Login successful");

        // Redirect based on role
        if (data.user.role === "client") {
          window.location.href = "/client/dashboard.html";
        } else if (data.user.role === "freelancer") {
          window.location.href = "/client/dashboard.html";
        } else {
          window.location.href = "/client/dashboard.html";
        }
      } else {
        alert("❌ " + (data.message || "Invalid email or password"));
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("❌ Could not connect to server.");
    }
  };
}

// ===== POST PROJECT FUNCTION =====
const postForm = document.getElementById("postProjectForm");
if (postForm) {
  postForm.onsubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    const project = {
      title: document.getElementById("projectTitle").value.trim(),
      description: document.getElementById("projectDescription").value.trim(),
      skills: document.getElementById("skills").value.trim(),
      budget: document.getElementById("budget").value.trim(),
      deadline: document.getElementById("deadline").value.trim(),
      client_id: userId
    };

    if (!project.title || !project.description || !project.skills || !project.budget || !project.deadline) {
      return alert("❗ Please fill in all fields.");
    }

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        window.location.href = "/client/dashboard.html";
      } else {
        alert("❌ " + (data.message || "Could not submit project."));
      }
    } catch (err) {
      console.error("Post Project Error:", err);
      alert("❌ Could not connect to server.");
    }
  };
}

// ===== SUBMIT PROPOSAL FUNCTION =====
const proposalForm = document.getElementById("proposalForm");
if (proposalForm) {
  proposalForm.onsubmit = async (e) => {
    e.preventDefault();

    const freelancerId = localStorage.getItem("userId");
    const projectId = new URLSearchParams(window.location.search).get("project_id");

    const pitch = document.getElementById("pitch").value.trim();
    const quote = document.getElementById("quote").value.trim();
    const timeline = document.getElementById("timeline").value.trim();

    if (!pitch || !quote || !timeline) {
      return alert("❗ Please fill in all fields.");
    }

    try {
      const res = await fetch(`${API_URL}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pitch,
          quote,
          timeline,
          project_id: projectId,
          freelancer_id: freelancerId
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        window.location.href = "/client/dashboard.html";
      } else {
        alert("❌ " + (data.message || "Could not submit proposal."));
      }
    } catch (err) {
      console.error("Proposal Error:", err);
      alert("❌ Could not submit proposal.");
    }
  };
}

// === PREFILL PROJECT DETAILS ON PROPOSAL FORM ===
const projectDetailsSection = document.getElementById("projectDetails");
const projectId = new URLSearchParams(window.location.search).get("project_id");

if (projectDetailsSection && projectId) {
  fetch(`${API_URL}/projects`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const project = data.projects.find(p => p.id == projectId);
        if (project) {
          projectDetailsSection.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Skills Required:</strong> ${project.skills}</p>
            <p><strong>Budget:</strong> ₹${project.budget}</p>
            <p><strong>Deadline:</strong> ${new Date(project.deadline).toLocaleDateString()}</p>
          `;
        } else {
          projectDetailsSection.innerHTML = "<p>⚠️ Project not found.</p>";
        }
      }
    })
    .catch(err => {
      console.error("Error fetching project:", err);
      projectDetailsSection.innerHTML = "<p>Error loading project details.</p>";
    });
}

// ===== DASHBOARD LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  const userRole = localStorage.getItem("role") || "client";  // Default to 'client'
  const userName = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("userId");

  // Client Dashboard
  if (userRole === "client") {
    document.getElementById("clientDashboard").classList.remove("hidden");
    document.getElementById("clientName").textContent = userName;

    // Fetch projects posted by the client
    fetch(`${API_URL}/projects/my-projects/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("clientProjects");
        container.innerHTML = ""; // Clear "Loading..." message

        if (data.success && data.projects.length > 0) {
          data.projects.forEach((project) => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
              <strong>${project.title}</strong><br>
              Budget: ₹${project.budget}<br>
              Deadline: ${new Date(project.deadline).toLocaleDateString()}<br>
              <a class="cta-button" href="#">View Details</a>
            `;
            container.appendChild(div);
          });
        } else {
          container.innerHTML = "<p>No projects found.</p>";
        }
      })
      .catch((err) => {
        console.error("Error loading client projects:", err);
        document.getElementById("clientProjects").innerHTML = "<p>Error loading projects.</p>";
      });

  } else {
    // Freelancer Dashboard
    document.getElementById("freelancerDashboard").classList.remove("hidden");
    document.getElementById("freelancerName").textContent = userName;

    // Fetch all available projects for freelancers
    fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("freelancerProjects");
        container.innerHTML = ""; // Clear "Loading..." message

        if (data.success && data.projects.length > 0) {
          data.projects.forEach((project) => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
              <strong>${project.title}</strong><br>
              Budget: ₹${project.budget}<br>
              Skills: ${project.skills}<br>
              Deadline: ${new Date(project.deadline).toLocaleDateString()}<br>
              <a class="cta-button" href="proposal-form.html?project_id=${project.id}">Apply</a>
            `;
            container.appendChild(div);
          });
        } else {
          container.innerHTML = "<p>No available projects.</p>";
        }
      })
      .catch((err) => {
        console.error("Error loading projects:", err);
        document.getElementById("freelancerProjects").innerHTML = "<p>Error loading projects.</p>";
      });
  }
}
);
