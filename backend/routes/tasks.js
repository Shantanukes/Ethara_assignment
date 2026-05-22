const router = require('express').Router();
const Task = require('../models/task.model');
const { auth } = require('../middleware/auth');

// ── GET all tasks ─────────────────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET tasks by project ──────────────────────────────────────────────────────
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET single task ───────────────────────────────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST create task ──────────────────────────────────────────────────────────
router.post('/add', auth, async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, status, priority, dueDate } = req.body;
    if (!title || !title.trim())
      return res.status(400).json({ success: false, error: 'Task title is required' });
    if (!status)
      return res.status(400).json({ success: false, error: 'Status is required' });
    if (!priority)
      return res.status(400).json({ success: false, error: 'Priority is required' });

    const newTask = new Task({
      projectId,
      title: title.trim(),
      description: description?.trim() || '',
      assignedTo,
      status,
      priority,
      dueDate,
    });

    const saved = await newTask.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST update task ──────────────────────────────────────────────────────────
router.post('/update/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    if (req.body.title !== undefined) task.title = req.body.title.trim();
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.projectId !== undefined) task.projectId = req.body.projectId;
    if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo;
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;

    await task.save();
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE all tasks for a project (cascade) — must be BEFORE /:id ───────────
router.delete('/byProject/:projectId', auth, async (req, res) => {
  try {
    const result = await Task.deleteMany({ projectId: req.params.projectId });
    res.json({ success: true, message: `${result.deletedCount} tasks deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE single task ────────────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
