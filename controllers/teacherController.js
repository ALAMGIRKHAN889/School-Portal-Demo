const Teacher = require('../models/Teacher');
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  const { name, email, password, employeeId, department, qualification, contactNumber } = req.body;
  
  try {
    // 1. Basic Validation
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // 2. Check if Employee ID already exists
    const existingTeacher = await Teacher.findOne({ employeeId });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Employee ID already in use' });
    }

    let userId = req.body.userId;

    // 3. Handle User Account
    if (!userId) {
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required for new teacher accounts' });
      }

      // Check if user account already exists by email
      let userAccount = await User.findOne({ email });
      
      if (!userAccount) {
        const hashedPassword = await bcrypt.hash(password || 'Teacher@123', 10);
        userAccount = await User.create({
          name,
          email,
          password: hashedPassword,
          role: 'teacher'
        });
      }
      
      userId = userAccount._id;
    }

    // 4. Create Teacher Profile
    const newTeacher = new Teacher({
      user: new mongoose.Types.ObjectId(userId), 
      employeeId,
      department,
      qualification,
      contactNumber
    });

    const savedTeacher = await newTeacher.save();
    
    // Return populated data
    const populatedTeacher = await Teacher.findById(savedTeacher._id).populate('user', 'name email');
    
    res.status(201).json(populatedTeacher);
  } catch (error) {
    console.error('Teacher Creation Error:', error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? `Validation Error: ${Object.values(error.errors).map(val => val.message).join(', ')}` 
        : error.message 
    });
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
