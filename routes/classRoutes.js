const express = require('express');
const router = express.Router();
const { getClasses, createClass, seedClasses } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getClasses)
  .post(protect, authorize('admin'), createClass);

router.route('/seed')
  .get(protect, authorize('admin'), seedClasses);

module.exports = router;
