const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const verifyToken = require("./middleware/auth");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API ToDo merge 🚀");
});

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Ai acces 🔐",
    user: req.user
  });
});

app.listen(3000, () => {
  console.log("Server pornit pe portul 3000");
});