const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // verificare input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email și parola sunt obligatorii" });
    }

    // verifică dacă user există
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User deja existent" });
    }

    // hash parola
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creează user
    user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ msg: "User creat cu succes" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // verificare input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email și parola sunt obligatorii" });
    }

    // caută user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User nu există" });
    }

    // compară parola
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Parolă greșită" });
    }

    // creează token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;