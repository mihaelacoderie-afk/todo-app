const express = require("express");
const Task = require("../models/Task");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Add task
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, deadline } = req.body;

    const task = new Task({
      user: req.user.id,
      title,
      deadline
    });

    await task.save();

    res.status(201).json({
      message: "Task adăugat",
      task
    });
  } catch (err) {
    res.status(500).json({
      message: "Eroare server",
      error: err.message
    });
  }
});

// Get all tasks for logged user
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({
      message: "Eroare server",
      error: err.message
    });
  }
});

// Update task
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, completed, deadline } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task inexistent" });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    if (deadline !== undefined) task.deadline = deadline;

    await task.save();

    res.status(200).json({
      message: "Task actualizat",
      task
    });
  } catch (err) {
    res.status(500).json({
      message: "Eroare server",
      error: err.message
    });
  }
});

// Delete task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task inexistent" });
    }

    res.status(200).json({ message: "Task șters" });
  } catch (err) {
    res.status(500).json({
      message: "Eroare server",
      error: err.message
    });
  }
});

module.exports = router;