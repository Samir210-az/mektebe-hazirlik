// routes/teachers.js
const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const user = new User({ ...req.body, role: 'teacher' });
    await user.save();
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Müəllim deaktiv edildi' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
