const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/records', require('./routes/records'));
app.use('/api/curriculum', require('./routes/curriculum'));

app.get('/', (req, res) => {
  res.json({ message: 'Məktəbəqədər Hazırlıq API işləyir ✅' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mektebe_hazirlik';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlantısı uğurlu ✅');
    app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir 🚀`));
  })
  .catch(err => console.error('MongoDB xətası:', err));
