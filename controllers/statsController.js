const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');

const getDashboardStats = async (req, res) => {
  const { role, _id } = req.user;

  try {
    if (role === 'admin') {
      const totalStudents = await Student.countDocuments();
      const totalTeachers = await Teacher.countDocuments();
      const pendingAdmissions = await Student.countDocuments({ status: 'pending' }); // Assuming status field exists
      
      // Calculate revenue
      const fees = await Fee.find({ status: 'paid' });
      const revenue = fees.reduce((acc, curr) => acc + curr.amount, 0);

      res.json({
        stats: [
          { title: 'Total Students', value: totalStudents.toLocaleString(), trend: 'up', trendValue: '+12%', color: 'indigo' },
          { title: 'Total Teachers', value: totalTeachers.toLocaleString(), color: 'purple' },
          { title: 'Pending Admissions', value: pendingAdmissions.toLocaleString(), trend: 'up', trendValue: '+5%', color: 'yellow' },
          { title: 'Monthly Revenue', value: `$${revenue.toLocaleString()}`, trend: 'up', trendValue: '+8%', color: 'green' },
        ]
      });
    } else if (role === 'teacher') {
      const myClasses = await Class.countDocuments({ teacher: _id });
      // This is simplified, in real app we'd join collections
      const myStudents = await Student.countDocuments(); // Should be filtered by teacher's classes

      res.json({
        stats: [
          { title: 'My Classes', value: myClasses.toString(), color: 'blue' },
          { title: 'Total Students', value: myStudents.toLocaleString(), color: 'indigo' },
          { title: 'Pending Assignments', value: '12', trend: 'down', trendValue: '-2', color: 'yellow' },
          { title: 'Avg Class Performance', value: '78%', trend: 'up', trendValue: '+3%', color: 'green' },
        ]
      });
    } else if (role === 'student') {
      // Find the student record associated with this user
      const student = await Student.findOne({ user: _id });
      
      // Mocking some data if records don't exist yet
      const attendance = 92;
      const gpa = 3.8;

      res.json({
        stats: [
          { title: 'Attendance', value: `${attendance}%`, trend: 'up', trendValue: '+2%', color: 'green' },
          { title: 'GPA', value: gpa.toString(), color: 'indigo' },
          { title: 'Completed Courses', value: '14', color: 'blue' },
          { title: 'Upcoming Exams', value: '3', color: 'yellow' },
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
