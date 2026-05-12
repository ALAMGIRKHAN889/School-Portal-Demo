const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  examType: {
    type: String, // e.g., "Midterm", "Final"
    required: true,
  },
  subjects: [{
    name: String,
    marksObtained: Number,
    totalMarks: Number,
  }],
  totalMarksObtained: Number,
  totalMaximumMarks: Number,
  percentage: Number,
  grade: String,
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
