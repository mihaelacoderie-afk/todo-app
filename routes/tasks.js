const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/auth");

// GET toate task-urile
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Eroare server" });
  }
});

// POST task nou
router.post("/", auth, async (req, res) => {
  try {
    const task = new Task({
      text: req.body.text,
      user: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Eroare server" });
  }
});

// PUT update task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task inexistent" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Nu ai acces" });
    }

    task.completed =
      req.body.completed !== undefined ? req.body.completed : task.completed;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Eroare server" });
  }
});

// DELETE task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task inexistent" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Nu ai acces" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task șters" });
  } catch (err) {
    res.status(500).json({ msg: "Eroare server" });
  }
});

module.exports = router;