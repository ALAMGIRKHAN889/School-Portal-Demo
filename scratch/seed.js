const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Class = require('../models/Class');

dotenv.config();

const seedClasses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    const existingClasses = await Class.find();
    if (existingClasses.length > 0) {
      console.log('Classes already exist, skipping seed.');
      process.exit();
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
    console.log('Seeded 6 classes successfully.');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedClasses();
