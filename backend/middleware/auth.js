const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ success: false, error: 'No token provided' });

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'taskflow_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminOnly };
