const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");
const attendanceMealRoutes = require("./routes/attendanceMealRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* -------- ROUTES -------- */
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", attendanceMealRoutes);
app.use("/api", attendanceRoutes);

/* -------- SERVER -------- */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

