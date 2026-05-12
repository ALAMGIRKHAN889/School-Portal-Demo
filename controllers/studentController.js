const Student = require('../models/Student');
const User = require('../models/User');

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email').populate('class', 'name section');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a student profile
const createStudent = async (req, res) => {
  const { userId, rollNumber, classId, dateOfBirth, address, parentName, parentContact } = req.body;
  try {
    const student = await Student.create({
      user: userId,
      rollNumber,
      class: classId,
      dateOfBirth,
      address,
      parentName,
      parentContact
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete a student profile
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Delete the associated user account
    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }
    // Delete the student profile
    await Student.findByIdAndDelete(req.params.id);
    
    // Also delete admission query if exists (optional, based on email or name)
    // We'll leave admission query intact but maybe marked as deleted if needed.
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, createStudent, deleteStudent };
