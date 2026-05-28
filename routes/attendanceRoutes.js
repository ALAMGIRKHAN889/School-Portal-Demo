const express = require('express');
const router = express.Router();
const { 
  markAttendance, 
  getAttendance, 
  updateAttendance, 
  deleteAttendance,
  bulkMarkAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('admin', 'teacher'), markAttendance)
  .get(protect, getAttendance);

router.route('/bulk')
  .post(protect, authorize('admin', 'teacher'), bulkMarkAttendance);

router.route('/:id')
  .put(protect, authorize('admin', 'teacher'), updateAttendance)
  .delete(protect, authorize('admin'), deleteAttendance);

module.exports = router;
