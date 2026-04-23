const express = require("express");
const router = express.Router();

const User = require("../models/User"); // ⚠️ EXACT așa (U mare)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User există" });

    const hashed = await bcrypt.hash(password, 10);

    user = new User({
      email,
      password: hashed,
    });

    await user.save();

    res.json({ msg: "User creat" });
  } catch (err) {
    res.status(500).send("Eroare server");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User nu există" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Parolă greșită" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).send("Eroare server");
  }
});

module.exports = router;