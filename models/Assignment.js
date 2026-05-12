const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  fileUrl: {
    type: String, // Optional URL to PDF
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
