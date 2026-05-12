const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "10th Grade"
  },
  section: {
    type: String,
    required: true, // e.g., "A"
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  subjects: [{
    type: String,
  }]
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
