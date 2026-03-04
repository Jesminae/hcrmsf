const express = require("express");
const router = express.Router();
const db = require("../db");

/* --------------------------------------------------
   ROLE-BASED LOGIN AUTHENTICATION
---------------------------------------------------*/
router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  // Basic validation
  if (!username || !password || !role) {
    return res.status(400).json({
      error: "Username, password, and role are required"
    });
  }

  const sql = `
    SELECT id, name, username, role, room_no
    FROM users
    WHERE username = ? AND password = ? AND role = ?
  `;

  db.query(sql, [username, password, role], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        error: "Database error"
      });
    }

    // No matching user
    if (results.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials or role"
      });
    }

    const user = results[0];

    // Successful login
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        room_no: user.room_no
      }
    });
  });
});

module.exports = router;
