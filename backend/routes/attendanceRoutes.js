const express = require("express");
const router = express.Router();
const db = require("../db");

/* =================================================
   STUDENT: Mark Attendance (ONE PER DAY)
================================================= */
router.post("/attendance/mark", (req, res) => {
  const { username, student_name } = req.body;

  if (!username || !student_name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `
    INSERT INTO attendance (username, student_name, date, status)
    VALUES (?, ?, CURDATE(), 'Present')
  `;

  db.query(sql, [username, student_name], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({ message: "Attendance already marked today" });
      }
      console.error(err);
      return res.status(500).json({ error: "Attendance failed" });
    }

    res.json({ message: "Attendance marked successfully" });
  });
});

/* =================================================
   WARDEN / COMMITTEE: ATTENDANCE BY SELECTED DATE
================================================= */
router.get("/attendance/by-date/:date", (req, res) => {
  const { date } = req.params;

  const sql = `
    SELECT 
      IFNULL(u.room_no, '-') AS room_no,
      a.student_name,
      a.status
    FROM attendance a
    LEFT JOIN users u ON a.username = u.username
    WHERE a.date = ?
    ORDER BY u.room_no, a.student_name
  `;

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch attendance" });
    }
    res.json(results);
  });
});

module.exports = router;
