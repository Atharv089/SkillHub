exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  const db = req.app.get("db");

  const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, password, role], (err, result) => {
    if (err) {
      console.error("❌ Register Error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(201).json({ message: "User registered successfully!" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const db = req.app.get("db");

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Login Error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    res.json({ success: true, user });
  });
};
