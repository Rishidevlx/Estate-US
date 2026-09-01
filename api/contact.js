export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Dynamic import to avoid issues in non-Node environments
    const nodemailer = (await import('nodemailer')).default;

    const { name, email, phone, subject, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Fetch settings from the backend DB
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
    const settingsRes = await fetch(`${apiUrl}/api/settings`);
    let mailConfig = null;
    let recipientEmail = 'homes@samprasrealty.com';
    
    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();
      if (settingsData && settingsData.mailConfig) {
        mailConfig = settingsData.mailConfig;
        recipientEmail = mailConfig.recipientEmail || recipientEmail;
      }
    }

    // Default to .env if not found in DB
    const smtpHost = mailConfig?.serviceProvider === 'CustomMail' ? 'smtp.zoho.com' : 'smtp.gmail.com'; // Adjust host based on provider if needed
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
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
        <br />
        <h4>Message:</h4>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email. Please try again later.' });
  }
}
