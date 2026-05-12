const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  classApplyingFor: { type: String, required: true },
  parentName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', admissionSchema);
