const mysql = require("mysql2");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing");
  process.exit(1);
}

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed");
    console.error(err);
  } else {
    console.log("✅ MySQL Connected to Railway");
    db.query(`
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  role ENUM('student','warden','committee'),
  username VARCHAR(50),
  password VARCHAR(100),
  room_no VARCHAR(10),
  UNIQUE KEY unique_username (username)
);

INSERT IGNORE INTO users (name, role, username, password, room_no) VALUES
('sandwana', 'student', 'sandwana', 'sand@123', 'B-203'),
('warden', 'warden', 'warden', 'warden@123', NULL);

CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100),
  username VARCHAR(50),
  category VARCHAR(50),
  description TEXT,
  status ENUM('Pending','In Progress','Resolved') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 );
  }
});

module.exports = db;