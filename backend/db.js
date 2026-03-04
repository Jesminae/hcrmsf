const mysql = require("mysql2");

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed");
    console.log(err);
  } else {
    console.log("✅ MySQL Connected to Railway");
  }
});

module.exports = db;