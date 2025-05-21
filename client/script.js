// script.js (UPDATED with messaging and bug fixes)
const API_URL = "http://127.0.0.1:4000";

// =======================
// REGISTER FUNCTION
// =======================
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
        body: JSON.stringify({ name, email, password, role }),
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

// =======================
// LOGIN FUNCTION
// =======================
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("username", data.user.name);

        //alert("✅ Login successful");

        if (data.user.role === "client") {
          window.location.href = "client.html";
        } else if (data.user.role === "freelancer") {
          window.location.href = "freelancer.html";
        } else {
          alert("❌ Invalid user role.");
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

// =======================
// POST PROJECT
// =======================
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
      client_id: userId,
    };

    if (!project.title || !project.description || !project.skills || !project.budget || !project.deadline) {
      return alert("❗ Please fill in all fields.");
    }

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        window.location.href = "client.html";
      } else {
        alert("❌ " + (data.message || "Could not submit project."));
      }
    } catch (err) {
      console.error("Post Project Error:", err);
      alert("❌ Could not connect to server.");
    }
  };
}

// =======================
// SUBMIT PROPOSAL
// =======================
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

    const res = await fetch(`${API_URL}/proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pitch,
        quote,
        timeline,
        project_id: projectId,
        freelancer_id: freelancerId
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ " + data.message);
      window.location.href = "freelancer.html";
    } else {
      alert("❌ " + (data.message || "Could not submit proposal."));
    }
  };
}





// =======================
// LOAD PROJECT DETAILS IN PROPOSAL FORM
// =======================
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
            <p><strong>Skills:</strong> ${project.skills}</p>
            <p><strong>Budget:</strong> ₹${project.budget}</p>
            <p><strong>Deadline:</strong> ${new Date(project.deadline).toLocaleDateString()}</p>
          `;
        } else {
          projectDetailsSection.innerHTML = "<p>⚠️ Project not found.</p>";
        }
      }
    })
    .catch(err => {
      console.error("Error loading project details:", err);
      projectDetailsSection.innerHTML = "<p>Error loading project info.</p>";
    });
}

// =======================
// MESSAGING SYSTEM
// =======================
const inboxContainer = document.getElementById("inbox");
const chatThread = document.getElementById("messageThread");
const newMessageInput = document.getElementById("newMessage");

let currentUserId = localStorage.getItem("userId");
let activeReceiverId = null;

if (inboxContainer) {
  fetch(`${API_URL}/messages/inbox/${currentUserId}`)
    .then(res => res.json())
    .then(data => {
      inboxContainer.innerHTML += "<ul>";
      data.forEach(user => {
        inboxContainer.innerHTML += `<li><button onclick="loadThread(${user.id})">${user.name}</button></li>`;
      });
      inboxContainer.innerHTML += "</ul>";
    });
}
// Auto-load a thread if URL has userId param
const urlUserId = new URLSearchParams(window.location.search).get("userId");
if (urlUserId) {
  loadThread(urlUserId);
}


function loadThread(receiverId) {
  activeReceiverId = receiverId;
  fetch(`${API_URL}/messages/thread/${currentUserId}/${receiverId}`)
    .then(res => res.json())
    .then(data => {
      chatThread.innerHTML = "";
      data.forEach(msg => {
        const side = msg.sender_id == currentUserId ? "You" : "Them";
        chatThread.innerHTML += `<p><strong>${side}:</strong> ${msg.content}</p>`;
      });
    });
}

function sendMessage() {
  const content = newMessageInput.value.trim();

  if (!content) {
    return alert("❗ Please type a message.");
  }

  if (!activeReceiverId) {
    return alert("❗ Please select a conversation from the inbox first.");
  }

  fetch(`${API_URL}/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender_id: currentUserId,
      receiver_id: activeReceiverId,
      content
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Message sent successfully") {
        newMessageInput.value = "";
        loadThread(activeReceiverId);
      } else {
        alert("❌ Failed to send message.");
        console.error(data);
      }
    })
    .catch(err => {
      console.error("Message error:", err);
      alert("❌ Could not send message.");
    });
}

