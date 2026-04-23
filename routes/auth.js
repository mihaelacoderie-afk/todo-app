const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Userul există deja" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "User creat cu succes" });
  } catch (err) {
    res.status(500).json({ message: "Eroare server", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User inexistent" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Parola greșită" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret123",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login reușit",
      token: token
    });
  } catch (err) {
    res.status(500).json({ message: "Eroare server", error: err.message });
  }
});

module.exports = router;