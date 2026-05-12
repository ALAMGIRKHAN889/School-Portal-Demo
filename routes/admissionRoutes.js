const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Submit Admission Form (public)
router.post('/submit', async (req, res) => {
  try {
    const newAdmission = new Admission(req.body);
    await newAdmission.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error });
  }
});

// Get All Admissions (Admin)
router.get('/all', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json(admissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admissions', error });
  }
});

// Approve Admission — creates User + Student record
router.patch('/:id/approve', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    if (admission.status === 'Approved') {
      return res.status(400).json({ message: 'Already approved' });
    }

    // Generate default login credentials
    const email = `${admission.firstName.toLowerCase()}.${admission.lastName.toLowerCase()}@school.edu`;
    const defaultPassword = `Student@${new Date().getFullYear()}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Create User account (skip if already exists)
    const userExists = await User.findOne({ email });
    let user = userExists;
    if (!userExists) {
      user = await User.create({
        name: `${admission.firstName} ${admission.lastName}`,
        email,
        password: hashedPassword,
        role: 'student',
      });
    }

    // Generate unique roll number
    const count = await Student.countDocuments();
    const rollNumber = `STU-${String(count + 1).padStart(4, '0')}`;

    // Create Student record
    await Student.create({
      user: user._id,
      rollNumber,
      dateOfBirth: admission.dob,
      parentName: admission.parentName,
      parentContact: admission.contactNumber,
    });

    // Mark admission as Approved
    admission.status = 'Approved';
    await admission.save();

    res.status(200).json({
      message: `Approved! Login: ${email} / ${defaultPassword}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving admission', error: error.message });
  }
});

// Delete Admission
router.delete('/:id', async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Admission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admission', error });
  }
});

module.exports = router;
