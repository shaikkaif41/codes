const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesAnalytics, getAllUsers, updateUserRole } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getSalesAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
