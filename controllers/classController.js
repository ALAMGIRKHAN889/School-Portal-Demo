const Class = require('../models/Class');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res) => {
  try {
    let classes = await Class.find().populate('teacher', 'name');
    
    // Auto-seed missing grades
    const requiredGrades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
    const existingNames = classes.map(c => c.name);
    const missingGrades = requiredGrades.filter(g => !existingNames.includes(g));

    if (missingGrades.length > 0) {
      const newClasses = missingGrades.map(g => ({ name: g, section: 'A' }));
      await Class.insertMany(newClasses);
      classes = await Class.find().populate('teacher', 'name');
    }
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private (Admin)
const createClass = async (req, res) => {
  const { name, section, teacher, subjects } = req.body;
  try {
    const newClass = await Class.create({ name, section, teacher, subjects });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Seed default classes
// @route   GET /api/classes/seed
// @access  Private (Admin)
const seedClasses = async (req, res) => {
  try {
    const existingClasses = await Class.find();
    if (existingClasses.length > 0) {
      return res.status(400).json({ message: 'Classes already exist' });
    }

    const classes = [
      { name: 'Grade 9', section: 'A' },
      { name: 'Grade 9', section: 'B' },
      { name: 'Grade 10', section: 'A' },
      { name: 'Grade 10', section: 'B' },
      { name: 'Grade 11', section: 'A' },
      { name: 'Grade 12', section: 'A' },
    ];

    await Class.insertMany(classes);
    res.json({ message: 'Seeded classes successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClasses, createClass, seedClasses };
