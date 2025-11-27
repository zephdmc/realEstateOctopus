import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { generateToken, verifyToken } from '../utils/auth.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorResponse('User already exists with this email', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  // Generate token
  const token = generateToken(user._id);

  // Remove password from response
  user.password = undefined;

  // Send verification email
  try {
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - EliteProperties',
      template: 'email-verification',
      context: {
        name: user.name,
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      }
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }

  res.status(201).json({
    success: true,
    data: {
      user,
      token
    },
    message: 'Registration successful. Please check your email for verification.'
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    throw new ErrorResponse('Please provide email and password', 400);
  }

  // Check for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ErrorResponse('Account has been deactivated', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Remove password from response
  user.password = undefined;

  res.status(200).json({
    success: true,
    data: {
      user,
      token
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    'profile.phone': req.body.phone,
    'profile.bio': req.body.bio,
    'profile.specialties': req.body.specialties,
    'profile.experience': req.body.experience,
    'profile.licenseNumber': req.body.licenseNumber
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    throw new ErrorResponse('Current password is incorrect', 401);
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse('No user found with this email', 404);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - EliteProperties',
      template: 'password-reset',
      context: {
        name: user.name,
        resetUrl,
        expiry: '10 minutes'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Failed to send reset email:', error);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    throw new ErrorResponse('Email could not be sent', 500);
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const crypto = await import('crypto');
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ErrorResponse('Invalid or expired reset token', 400);
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Verify email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const crypto = await import('crypto');
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken
  });

  if (!user) {
    throw new ErrorResponse('Invalid verification token', 400);
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});