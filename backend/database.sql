USE railway;

-- USERS
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
('nishitha', 'student', 'nishitha', 'nishi@123', 'B-203'),
('aishwarya', 'student', 'aishwarya', 'aish@123', 'B-205'),
('jesmina', 'student', 'jesmina', 'jesmi@123', 'B-206'),
('Warden Sir', 'warden', 'warden', 'warden@123', NULL),
('Committee Member', 'committee', 'committee', 'committee@123', NULL);

-- COMPLAINTS
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100),
  username VARCHAR(50),
  category VARCHAR(50),
  description TEXT,
  status ENUM('Pending','In Progress','Resolved') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100),
  username VARCHAR(50),
  date DATE,
  status ENUM('Present','Absent') DEFAULT 'Present',
  UNIQUE KEY unique_attendance_user_day (username, date)
);

-- MEAL COUNT
CREATE TABLE IF NOT EXISTS meal_count (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100),
  username VARCHAR(50),
  meal_type ENUM('Veg','Non-Veg'),
  date DATE,
  UNIQUE KEY unique_meal_user_day (username, date)
);

DELETE FROM attendance WHERE username IS NULL;

-- MEAL SETTINGS
CREATE TABLE IF NOT EXISTS meal_settings (
  id INT PRIMARY KEY,
  enabled BOOLEAN
);

INSERT IGNORE INTO meal_settings (id, enabled) VALUES (1, true);

DELETE FROM meal_count
WHERE username IS NULL;


