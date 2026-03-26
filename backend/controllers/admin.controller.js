const adminService = require('../services/admin.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const getDashboardStats = catchAsync(async (_req, res) => {
  const stats = await adminService.getDashboardStats();
  ApiResponse.success(res, stats);
});

const getSalesAnalytics = catchAsync(async (req, res) => {
  const { period } = req.query;
  const analytics = await adminService.getSalesAnalytics(period);
  ApiResponse.success(res, analytics);
});

const getAllUsers = catchAsync(async (req, res) => {
  const { users, pagination } = await adminService.getAllUsers(req.query);
  ApiResponse.paginated(res, users, pagination);
});

const updateUserRole = catchAsync(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role);
  ApiResponse.success(res, user, 'User role updated');
});

module.exports = { getDashboardStats, getSalesAnalytics, getAllUsers, updateUserRole };
