const mongoose = require('mongoose');
const User = require('../models/User');
const Market = require('../models/Market');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { notifyAdmins } = require('../utils/notifications');

const sendAuthResponse = (res, statusCode, message, user) => {
  const token = generateToken(user);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: { user },
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, preferredMarket } = req.body;
  let validPreferredMarket;
  if (preferredMarket) {
    if (!mongoose.isValidObjectId(preferredMarket)) throw new AppError('Preferred market is invalid', 400);
    validPreferredMarket = await Market.findOne({ _id: preferredMarket, isActive: true }).select('_id');
    if (!validPreferredMarket) throw new AppError('Preferred market is not available', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    preferredMarket: validPreferredMarket?._id,
    role: 'customer',
    accountStatus: 'active',
  });
  sendAuthResponse(res, 201, 'Customer registered successfully', user);
});

const registerFarmer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, farmName, location, registrationNumber } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    farmName,
    location,
    registrationNumber,
    role: 'farmer',
    accountStatus: 'pending',
  });
  await notifyAdmins({
    type: 'farmer_registered',
    title: 'New farmer registration',
    message: `${user.farmName || user.name} is awaiting approval.`,
    eventKey: `farmer-registration:${user._id}`,
  });

  sendAuthResponse(
    res,
    201,
    'Farmer registered successfully and is awaiting approval',
    user
  );
});

const login = asyncHandler(async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select('+password +tokenVersion');

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.accountStatus === 'suspended') {
    throw new AppError('This account has been suspended', 403);
  }

  sendAuthResponse(res, 200, 'Login successful', user);
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'address', 'farmName', 'location', 'operatingDays', 'pickupStartTime', 'pickupEndTime', 'orderCutoffTime', 'pickupSlotMinutes', 'coordinates', 'preferredMarket', 'markets', 'bio'];
  const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
  ['pickupStartTime', 'pickupEndTime', 'orderCutoffTime'].forEach((field) => {
    if (req.body[field] !== undefined && !timePattern.test(req.body[field])) throw new AppError(`${field} must use HH:MM format`, 400);
  });
  const pickupStart = req.body.pickupStartTime ?? req.user.pickupStartTime;
  const pickupEnd = req.body.pickupEndTime ?? req.user.pickupEndTime;
  if (pickupStart && pickupEnd && pickupStart >= pickupEnd) throw new AppError('Pickup end time must be after pickup start time', 400);
  if (req.body.pickupSlotMinutes !== undefined && (!Number.isInteger(Number(req.body.pickupSlotMinutes)) || Number(req.body.pickupSlotMinutes) < 15 || Number(req.body.pickupSlotMinutes) > 240)) {
    throw new AppError('Pickup slot minutes must be an integer from 15 to 240', 400);
  }
  if (req.body.preferredMarket === '' || req.body.preferredMarket === null) {
    req.body.preferredMarket = null;
  } else if (req.body.preferredMarket !== undefined) {
    if (req.user.role !== 'customer' || !mongoose.isValidObjectId(req.body.preferredMarket)) throw new AppError('Preferred market is invalid', 400);
    const market = await Market.findOne({ _id: req.body.preferredMarket, isActive: true }).select('_id');
    if (!market) throw new AppError('Preferred market is not available', 400);
  }
  const updates = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).populate('preferredMarket', 'name address');
  res.status(200).json({ success: true, message: 'Profile updated successfully', data: { user } });
});

const logout = asyncHandler(async (req, res) => {
  // Invalidate all JWTs previously issued to this account.
  req.user.tokenVersion += 1;
  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = { register, registerFarmer, login, getMe, updateMe, logout };

