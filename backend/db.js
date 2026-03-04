const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jesmi@7012", // VERY IMPORTANT
  database: "hcrms",
  port: 3306                           // ADD THIS LINE
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed");
    console.log("ERROR DETAILS:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;
