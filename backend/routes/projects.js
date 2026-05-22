const router = require('express').Router();
const Project = require('../models/project.model');
const { auth, adminOnly } = require('../middleware/auth');

// ── GET all projects ──────────────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET single project ────────────────────────────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST create project (admin only) ─────────────────────────────────────────
router.post('/add', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ success: false, error: 'Project name is required' });

    const newProject = new Project({
      name: name.trim(),
      description: description?.trim() || '',
      createdBy: req.user.id,
      members: members && members.length > 0 ? members : [req.user.id],
    });

    const saved = await newProject.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST update project (admin only) ─────────────────────────────────────────
router.post('/update/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    if (req.body.name !== undefined) project.name = req.body.name.trim();
    if (req.body.description !== undefined) project.description = req.body.description.trim();
    if (req.body.members !== undefined) project.members = req.body.members;

    await project.save();
    res.json({ success: true, message: 'Project updated', data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE project (admin only) ───────────────────────────────────────────────
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
