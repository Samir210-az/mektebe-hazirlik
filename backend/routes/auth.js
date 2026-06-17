const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'mektebe_hazirlik_secret_2024';

// Qeydiyyat
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, language } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Bu email artıq mövcuddur' });

    const user = new User({ name, email, password, role: role || 'parent', phone, language: language || 'az' });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Giriş
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email və ya şifrə yanlışdır' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Email və ya şifrə yanlışdır' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cari istifadəçi
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
