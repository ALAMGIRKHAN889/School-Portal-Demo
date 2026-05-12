const express = require('express');
const router = express.Router();
const { getTeachers, createTeacher, deleteTeacher } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTeachers)
  .post(protect, authorize('admin'), createTeacher);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteTeacher);

module.exports = router;
