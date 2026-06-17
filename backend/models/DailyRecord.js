const mongoose = require('mongoose');

const dailyRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },

  // Keçirilən məşğələlər
  lessonsCompleted: [{
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    lessonName: { type: String },
    subject: { type: String },
    duration: { type: Number }, // dəqiqə
    completed: { type: Boolean, default: true }
  }],

  // Qiymətlər (1-10 sistem)
  grades: [{
    subject: { type: String },
    grade: { type: Number, min: 1, max: 10 },
    comment: { type: String }
  }],

  // Davranış
  behavior: {
    rating: { type: String, enum: ['excellent', 'good', 'satisfactory', 'needs_improvement'] },
    emoji: { type: String }, // 😊 😐 😢 ⭐
    notes: { type: String },
    attention: { type: Number, min: 1, max: 5 },
    activity: { type: Number, min: 1, max: 5 },
    cooperation: { type: Number, min: 1, max: 5 }
  },

  // Ümumi qiymət (ortalama)
  averageGrade: { type: Number },

  // Müəllim qeydi
  teacherNote: { type: String },

  // Val/dayı üçün mesaj
  parentMessage: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// Ortalama qiyməti avtomatik hesabla
dailyRecordSchema.pre('save', function(next) {
  if (this.grades && this.grades.length > 0) {
    const total = this.grades.reduce((sum, g) => sum + g.grade, 0);
    this.averageGrade = Math.round((total / this.grades.length) * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('DailyRecord', dailyRecordSchema);
