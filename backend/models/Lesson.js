const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    az: { type: String, required: true },
    ru: { type: String },
    en: { type: String }
  },
  subject: {
    type: String,
    enum: ['math', 'language', 'reading', 'drawing', 'music', 'physical', 'nature', 'logic', 'creativity'],
    required: true
  },
  week: { type: Number, min: 1, max: 8 }, // 8 həftə = 2 ay
  day: { type: Number, min: 1, max: 5 },  // həftənin günü
  order: { type: Number }, // gün içindəki sıra

  description: {
    az: { type: String },
    ru: { type: String },
    en: { type: String }
  },

  objectives: [{
    az: String,
    ru: String,
    en: String
  }],

  materials: [{ type: String }],

  activities: [{
    title: { az: String, ru: String, en: String },
    description: { az: String, ru: String, en: String },
    duration: { type: Number }, // dəqiqə
    image: { type: String },
    type: { type: String, enum: ['game', 'exercise', 'story', 'song', 'craft', 'counting', 'writing'] }
  }],

  images: [{ type: String }],
  videoUrl: { type: String },
  duration: { type: Number, default: 30 }, // ümumi müddət dəqiqə

  ageGroup: { type: String, default: '5-6' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);
