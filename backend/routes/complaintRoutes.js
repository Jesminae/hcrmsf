const express = require("express");
const router = express.Router();
const db = require("../db");

// Import ML classifier
const predictCategory = require("../ml/complaintClassifier");

/* --------------------------------------------------
   STUDENT: Submit Complaint (ML-based categorization)
---------------------------------------------------*/
router.post("/add", (req, res) => {
  const { student_name, username, description } = req.body;

  if (!student_name || !username || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Predict category using ML
  const category = predictCategory(description);

  const sql = `
    INSERT INTO complaints (student_name, username, category, description)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [student_name, username, category, description], (err) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "Complaint submitted successfully",
      predictedCategory: category
    });
  });
});

/* --------------------------------------------------
   WARDEN: View All Complaints
---------------------------------------------------*/
router.get("/", (req, res) => {
  const sql = "SELECT * FROM complaints ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

/* --------------------------------------------------
   WARDEN: Update Complaint Status
---------------------------------------------------*/
router.put("/update/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const sql = "UPDATE complaints SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Complaint status updated successfully" });
  });
});

/* --------------------------------------------------
   STUDENT: View Own Complaints
---------------------------------------------------*/
router.get("/student/:username", (req, res) => {
  const { username } = req.params;

  const sql = `
    SELECT category, description, status, created_at
    FROM complaints
    WHERE username = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch complaints" });
    }
    res.json(results);
  });
});

module.exports = router;

