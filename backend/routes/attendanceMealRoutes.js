const express = require("express");
const router = express.Router();
const db = require("../db");

/* ==================================================
   STUDENT: Mark Attendance (ONE PER DAY)
================================================== */
router.post("/attendance", (req, res) => {
  const { student_name, username, status } = req.body;

  if (!student_name || !username || !status) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `
    INSERT INTO attendance (student_name, username, date, status)
    VALUES (?, ?, CURDATE(), ?)
  `;

  db.query(sql, [student_name, username, status], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          error: "Attendance already marked for today"
        });
      }
      console.error(err);
      return res.status(500).json({ error: "Attendance error" });
    }

    res.json({ message: "Attendance marked successfully" });
  });
});

/* ==================================================
   STUDENT: Submit Meal Preference (ONE PER DAY)
================================================== */
router.post("/meal", (req, res) => {
  const { student_name, username, meal_type } = req.body;

  if (!student_name || !username || !meal_type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `
    INSERT INTO meal_count (student_name, username, meal_type, date)
    VALUES (?, ?, ?, CURDATE())
  `;

  db.query(sql, [student_name, username, meal_type], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          error: "Meal preference already submitted for today"
        });
      }
      console.error(err);
      return res.status(500).json({ error: "Meal entry failed" });
    }

    res.json({ message: "Meal preference submitted successfully" });
  });
});

/* ==================================================
   COMMITTEE: Meal Summary (Today)
================================================== */
router.get("/meal-summary", (req, res) => {
  const sql = `
    SELECT meal_type, COUNT(*) AS count
    FROM meal_count
    WHERE date = CURDATE()
    GROUP BY meal_type
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Summary error" });
    }
    res.json(results);
  });
});

/* ==================================================
   COMMITTEE: Student Meal List (Today with Room No)
================================================== */
router.get("/meal-list", (req, res) => {
  const sql = `
    SELECT 
      u.room_no,
      m.student_name,
      m.meal_type
    FROM meal_count m
    INNER JOIN users u ON m.username = u.username
    WHERE m.date = CURDATE()
    ORDER BY u.room_no, m.student_name
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch meal list" });
    }
    res.json(results);
  });
});

/* ==================================================
   COMMITTEE: Delete Single Meal Entry (Password Protected)
================================================== */
router.delete("/meal/:username/:date", (req, res) => {
  const { username, date } = req.params;
  const { committeePassword } = req.body;

  if (!committeePassword) {
    return res.status(400).json({ error: "Committee password required" });
  }

  const checkSql = `
    SELECT id FROM users
    WHERE role='committee' AND password=?
  `;

  db.query(checkSql, [committeePassword], (err, results) => {
    if (err) return res.status(500).json({ error: "Password verification failed" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid committee password" });
    }

    const deleteSql = `
      DELETE FROM meal_count
      WHERE username=? AND date=?
    `;

    db.query(deleteSql, [username, date], (err, result) => {
      if (err) return res.status(500).json({ error: "Delete failed" });

      res.json({ message: "Meal entry deleted successfully" });
    });
  });
});

/* ==================================================
   COMMITTEE: Delete ALL Meal Entries Today (Password Protected)
================================================== */
router.delete("/meal-delete-all", (req, res) => {
  const { committeePassword } = req.body;

  if (!committeePassword) {
    return res.status(400).json({ error: "Password required" });
  }

  const verifySql = `
    SELECT id FROM users
    WHERE role='committee' AND password=?
  `;

  db.query(verifySql, [committeePassword], (err, results) => {
    if (err) return res.status(500).json({ error: "Password verification failed" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid committee password" });
    }

    const deleteSql = `
      DELETE FROM meal_count WHERE date = CURDATE()
    `;

    db.query(deleteSql, (err, result) => {
      if (err) return res.status(500).json({ error: "Delete failed" });

      res.json({
        message: `Deleted ${result.affectedRows} meal entries for today`
      });
    });
  });
});

/* ==================================================
   MEAL ENABLE / DISABLE SYSTEM
================================================== */

/* Get meal status */
router.get("/meal-status", (req, res) => {
  db.query("SELECT enabled FROM meal_settings WHERE id=1", (err, rows) => {
    if (err) return res.status(500).json({ error: "Status fetch failed" });
    res.json({ enabled: rows[0].enabled });
  });
});

/* Toggle meal status */
router.post("/meal-toggle", (req, res) => {
  db.query(
    "UPDATE meal_settings SET enabled = NOT enabled WHERE id=1",
    (err) => {
      if (err) return res.status(500).json({ error: "Toggle failed" });
      res.json({ message: "Meal status toggled successfully" });
    }
  );
});

/* -----------------------------------------------
   COMMITTEE: Monthly Meal Count (Per Student)
------------------------------------------------*/
router.get("/meal-monthly-student/:year/:month", (req, res) => {
  const { year, month } = req.params;

  const sql = `
    SELECT 
      m.username,
      SUM(CASE WHEN m.meal_type = 'Veg' THEN 1 ELSE 0 END) AS veg_count,
      SUM(CASE WHEN m.meal_type = 'Non-Veg' THEN 1 ELSE 0 END) AS nonveg_count,
      COUNT(*) AS total
    FROM meal_count m
    WHERE 
      YEAR(m.date) = ? 
      AND MONTH(m.date) = ?
      AND m.username IS NOT NULL
    GROUP BY m.username
    ORDER BY m.username
  `;

  db.query(sql, [year, month], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Monthly student report error" });
    }
    res.json(results);
  });
});
module.exports = router;
