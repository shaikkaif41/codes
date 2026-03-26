const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  ApiResponse.created(res, result, 'Registration successful');
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  ApiResponse.success(res, result, 'Login successful');
});

const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  ApiResponse.success(res, user);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  ApiResponse.success(res, user, 'Profile updated successfully');
});

const changePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(req.user._id, req.body);
  ApiResponse.success(res, result);
});

module.exports = { register, login, getProfile, updateProfile, changePassword };
