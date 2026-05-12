const express = require('express');
const router = express.Router();
const { getStudents, createStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('admin'), createStudent);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteStudent);

module.exports = router;
