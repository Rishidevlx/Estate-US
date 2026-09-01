const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');
const Enquiry = require('../models/Enquiry');

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate inputs
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Save to Database first
    const newEnquiry = new Enquiry({ name, email, phone, subject, message });
    await newEnquiry.save();

    // Fetch settings from the backend DB directly
    const settings = await Settings.findOne();
    let mailConfig = settings?.mailConfig;
    let recipientEmail = mailConfig?.recipientEmail || 'homes@samprasrealty.com';

    // Default to .env if not found in DB
    const smtpHost = mailConfig?.serviceProvider === 'CustomMail' ? 'smtp.zoho.com' : 'smtp.gmail.com'; 
    const smtpUser = mailConfig?.senderAccount || process.env.SMTP_USER;
    const smtpPass = mailConfig?.appPassword || process.env.SMTP_PASS;

    // Create a transporter using DB config or fallback
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: process.env.SMTP_PORT || 465,
      secure: true, 
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Setup email data
    const mailOptions = {
      from: `"${name}" <${smtpUser}>`, // Must send from the authenticated email
      replyTo: email,
      to: recipientEmail, // list of receivers
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Subject: ${subject || 'Not provided'}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fbf9; border-radius: 8px; border: 1px solid #e0e6e2;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #113c2b;">
            <h2 style="color: #113c2b; margin: 0; font-size: 24px;">New Lead Received!</h2>
            <p style="color: #666; margin-top: 5px; font-size: 14px;">Sampras Realty Group</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">You have received a new contact form submission from the website.</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; width: 30%; font-weight: bold; color: #113c2b;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; font-weight: bold; color: #113c2b;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; color: #333;"><a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; font-weight: bold; color: #113c2b;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; color: #333;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; font-weight: bold; color: #113c2b;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e6e2; color: #333;">${subject || 'Not provided'}</td>
              </tr>
            </table>
            
            <div style="margin-top: 25px; background-color: #ffffff; padding: 20px; border-radius: 6px; border-left: 4px solid #d4af37; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h4 style="margin-top: 0; color: #113c2b; font-size: 16px; margin-bottom: 10px;">Message:</h4>
              <p style="color: #444; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message || 'No message provided.'}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 20px; margin-top: 20px; border-top: 1px solid #e0e6e2;">
            <p style="color: #888; font-size: 12px; margin: 0;">This email was sent automatically from the Sampras Realty Group Website.</p>
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email sent and enquiry saved successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to process request. Please try again later.' });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTodayEnquiries = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const enquiries = await Enquiry.find({
      createdAt: { $gte: startOfToday }
    }).sort({ createdAt: -1 });

    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['New', 'Inprogress', 'On-Hold', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    res.status(200).json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
