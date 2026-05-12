const Teacher = require('../models/Teacher');
const User = require('../models/User');

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user', 'name email');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a teacher profile
const createTeacher = async (req, res) => {
  const { userId, employeeId, department, qualification, contactNumber } = req.body;
  try {
    const teacher = await Teacher.create({
      user: userId,
      employeeId,
      department,
      qualification,
      contactNumber
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a teacher profile
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    // Delete associated user
    if (teacher.user) {
      await User.findByIdAndDelete(teacher.user);
    }
    // Delete teacher profile
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTeachers, createTeacher, deleteTeacher };
