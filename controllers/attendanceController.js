const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private (Teacher/Admin)
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status } = req.body;

    // Check if attendance already exists for this date and student
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      class: classId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.status(200).json(existingAttendance);
    }

    const attendance = await Attendance.create({
      student: studentId,
      class: classId,
      date,
      status
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark bulk attendance
// @route   POST /api/attendance/bulk
// @access  Private (Teacher/Admin)
exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { records, classId, date } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Invalid records format' });
    }

    const attendanceRecords = await Promise.all(records.map(async (rec) => {
      const query = {
        student: rec.studentId,
        class: classId,
        date: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      };

      const update = { status: rec.status, date: new Date(date) };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      return Attendance.findOneAndUpdate(query, update, options);
    }));

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance records based on role
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    const { role } = req.user;
    let query = {};
    const { classId, date, studentId } = req.query;

    if (classId) query.class = classId;
    
    // Admin sees all based on query
    if (role === 'student') {
      // Find the student record associated with the user
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ message: 'Student record not found' });
      }
      query.student = student._id;
    } else if (studentId) {
      query.student = studentId;
    }

    if (date) {
      query.date = {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'firstName lastName admissionNumber')
      .populate('class', 'name section')
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Teacher/Admin)
exports.updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.status = status;
    await attendance.save();

    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin)
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.deleteOne();
    res.status(200).json({ message: 'Attendance removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
