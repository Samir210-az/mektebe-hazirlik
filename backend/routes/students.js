const express = require('express');
const Student = require('../models/Student');
const DailyRecord = require('../models/DailyRecord');
const { auth, teacherOrAdmin, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Bütün uşaqlar (admin/müəllim üçün)
router.get('/', auth, teacherOrAdmin, async (req, res) => {
  try {
    const filter = req.user.role === 'teacher' ? { teacherId: req.user._id } : {};
    const students = await Student.find(filter).populate('teacherId', 'name email').populate('parentId', 'name email phone');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Valideynin öz uşağı
router.get('/my-children', auth, async (req, res) => {
  try {
    const students = await Student.find({ parentId: req.user._id }).populate('teacherId', 'name');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tək uşaq
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('teacherId', 'name email').populate('parentId', 'name email phone');
    if (!student) return res.status(404).json({ message: 'Uşaq tapılmadı' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Uşaq əlavə et
router.post('/', auth, teacherOrAdmin, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Uşaq yenilə
router.put('/:id', auth, teacherOrAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2 aylıq nəticə
router.get('/:id/report', auth, async (req, res) => {
  try {
    const records = await DailyRecord.find({ studentId: req.params.id }).sort({ date: 1 });
    
    const summary = {
      totalDays: records.length,
      averageGrade: 0,
      subjectAverages: {},
      behaviorStats: { excellent: 0, good: 0, satisfactory: 0, needs_improvement: 0 },
      weeklyAverages: [],
      monthlyProgress: []
    };

    if (records.length > 0) {
      const allGrades = records.flatMap(r => r.grades || []);
      if (allGrades.length > 0) {
        summary.averageGrade = Math.round(allGrades.reduce((s, g) => s + g.grade, 0) / allGrades.length * 10) / 10;
        
        const bySubject = {};
        allGrades.forEach(g => {
          if (!bySubject[g.subject]) bySubject[g.subject] = [];
          bySubject[g.subject].push(g.grade);
        });
        Object.keys(bySubject).forEach(s => {
          summary.subjectAverages[s] = Math.round(bySubject[s].reduce((a,b) => a+b,0) / bySubject[s].length * 10) / 10;
        });
      }

      records.forEach(r => {
        if (r.behavior?.rating) summary.behaviorStats[r.behavior.rating]++;
      });
    }

    res.json({ student: req.params.id, records, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
