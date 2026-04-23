const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const verifyToken = require("./middleware/auth");

const app = express();

// conectare DB
connectDB();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API ToDo merge 🚀");
});

// protected route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Ai acces 🔐",
    user: req.user
  });
});

// 🔥 IMPORTANT PENTRU RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});