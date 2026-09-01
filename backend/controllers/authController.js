const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Seed admin if not exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await Admin.create({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
      });
    }

    // 2. Find admin in DB
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 4. Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, role: 'admin', email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { 
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        profilePic: admin.profilePic,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  // Use DB settings to send email
  const Settings = require('../models/Settings');
  const settings = await Settings.findOne();
  let mailConfig = settings?.mailConfig;
  
  const smtpHost = mailConfig?.serviceProvider === 'CustomMail' ? 'smtp.zoho.com' : 'smtp.gmail.com'; 
  const smtpUser = mailConfig?.senderAccount || process.env.SMTP_USER;
  const smtpPass = mailConfig?.appPassword || process.env.SMTP_PASS;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const mailOptions = {
    from: `"Sampras Admin" <${smtpUser}>`,
    to: email,
    subject: `Your Password Reset OTP - Sampras Realty`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #113c2b;">Password Reset Request</h2>
        <p>You requested to reset your password. Use the OTP below to proceed.</p>
        <div style="margin: 20px 0; padding: 15px; background: #f4f4f4; border-radius: 4px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #d4af37;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #888;">This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin with this email not found' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOTP = otp;
    admin.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await admin.save();

    await sendOTPEmail(email, otp);
    return res.status(200).json({ success: true, message: 'OTP sent to email successfully' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process request' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email, resetOTP: otp, resetOTPExpiry: { $gt: Date.now() } });
    
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email, resetOTP: otp, resetOTPExpiry: { $gt: Date.now() } });
    
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired session. Try again.' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.resetOTP = null;
    admin.resetOTPExpiry = null;
    await admin.save();

    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Middleware to verify JWT token for future protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided. Unauthorized.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { login, verifyToken, forgotPassword, verifyOTP, resetPassword };
