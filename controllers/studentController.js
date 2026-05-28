const Student = require('../models/Student');
const User = require('../models/User');

// Get all students
const getStudents = async (req, res) => {
  try {
    let query = {};
    if (req.query.classId) {
      query.class = req.query.classId;
    }
    
    let students = await Student.find(query)
      .populate('user', 'name email')
      .populate('class', 'name section');

    // SELF-HEALING: If students have no class, try to assign them to "Grade 10" as a fallback or fix
    const unassigned = students.filter(s => !s.class);
    if (unassigned.length > 0) {
      const Class = require('../models/Class');
      let defaultClass = await Class.findOne({ name: 'Grade 10' });
      if (!defaultClass) {
        defaultClass = await Class.create({ name: 'Grade 10', section: 'A' });
      }
      
      for (let s of unassigned) {
        s.class = defaultClass._id;
        await s.save();
      }
      
      // Re-fetch with population
      students = await Student.find(query)
        .populate('user', 'name email')
        .populate('class', 'name section');
    }

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
