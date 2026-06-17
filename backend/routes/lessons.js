const express = require('express');
const Lesson = require('../models/Lesson');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { subject, week, day } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (week) filter.week = parseInt(week);
    if (day) filter.day = parseInt(day);
    const lessons = await Lesson.find(filter).sort({ week: 1, day: 1, order: 1 });
    res.json(lessons);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Məşğələ tapılmadı' });
    res.json(lesson);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lesson);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
