const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password -resetOTP -resetOTPExpiry');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, profilePic, designation } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email) {
      const existing = await Admin.findOne({ email, _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
      }
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, email, profilePic, designation },
      { new: true }
    ).select('-password -resetOTP -resetOTPExpiry');

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
