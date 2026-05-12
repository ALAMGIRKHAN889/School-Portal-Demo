const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending',
  },
  month: {
    type: String, // e.g., "January 2026"
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
