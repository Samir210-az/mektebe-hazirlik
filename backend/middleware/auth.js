const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Token tapılmadı' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mektebe_hazirlik_secret_2024');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'İstifadəçi tapılmadı' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token etibarsızdır' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Yalnız admin' });
  next();
};

const teacherOrAdmin = (req, res, next) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'İcazə yoxdur' });
  next();
};

module.exports = { auth, adminOnly, teacherOrAdmin };
