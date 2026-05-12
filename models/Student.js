const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  dateOfBirth: {
    type: Date,
  },
  address: {
    type: String,
  },
  parentName: {
    type: String,
  },
  parentContact: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
