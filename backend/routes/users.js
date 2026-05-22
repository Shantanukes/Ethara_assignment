const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { auth, adminOnly } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_secret_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ── GET all users (auth required) ────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET current user from token ───────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST login ────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    // Support both bcrypt hashed and plain passwords (for seeded demo data)
    const isMatch = user.password.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!isMatch)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    const token = signToken(user);
    const userData = user.toObject();
    delete userData.password;
    userData.id = String(userData._id);

    res.json({ success: true, data: { token, user: userData } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST register ─────────────────────────────────────────────────────────────
router.post('/add', async (req, res) => {
  try {
    const { name, email, password, role, initials, color } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(409).json({ success: false, error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'member',
      initials: initials || name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      color: color || 'blue',
    });

    const saved = await newUser.save();
    const token = signToken(saved);
    const userData = saved.toObject();
    delete userData.password;
    userData.id = String(userData._id);

    res.status(201).json({ success: true, data: { token, user: userData } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST update user role (admin only) ───────────────────────────────────────
router.post('/update/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (req.body.role !== undefined) user.role = req.body.role;
    if (req.body.name !== undefined) user.name = req.body.name;
    await user.save();
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE user (admin only) ──────────────────────────────────────────────────
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ success: false, error: 'Cannot delete yourself' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
