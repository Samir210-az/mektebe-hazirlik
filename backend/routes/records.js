const express = require('express');
const DailyRecord = require('../models/DailyRecord');
const { auth, teacherOrAdmin } = require('../middleware/auth');
const router = express.Router();

// Gündəlik qeyd əlavə et
router.post('/', auth, teacherOrAdmin, async (req, res) => {
  try {
    const record = new DailyRecord({ ...req.body, teacherId: req.user._id });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Uşağın qeydləri
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { studentId: req.params.studentId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const records = await DailyRecord.find(filter).sort({ date: -1 }).populate('lessonsCompleted.lessonId', 'title subject');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bu günün qeydi
router.get('/today/:studentId', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await DailyRecord.findOne({
      studentId: req.params.studentId,
      date: { $gte: today, $lt: tomorrow }
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Qeydi yenilə
router.put('/:id', auth, teacherOrAdmin, async (req, res) => {
  try {
    const record = await DailyRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bütün qeydlər (admin üçün statistika)
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const total = await DailyRecord.countDocuments();
    const today = new Date(); today.setHours(0,0,0,0);
    const todayCount = await DailyRecord.countDocuments({ date: { $gte: today } });
    res.json({ total, todayCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
