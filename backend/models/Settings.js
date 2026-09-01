const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  phone: { type: String, default: '+1 (555) 123-4567' },
  email: { type: String, default: 'info@samprasrealty.com' },
  address: { type: String, default: '123 Real Estate Ave, Suite 100\nNew York, NY 10001' },
  mapLocation: { type: String, default: '' },
  facebook: { type: String, default: 'https://facebook.com/sampras' },
  twitter: { type: String, default: 'https://twitter.com/sampras' },
  instagram: { type: String, default: 'https://instagram.com/sampras' },
  linkedin: { type: String, default: 'https://linkedin.com/company/sampras' },
  logo: { type: String, default: '/sampras.png' },
  
  mailConfig: {
    recipientEmail: { type: String, default: 'admin@samprasrealty.com' },
    serviceProvider: { type: String, default: 'Nodemailer' }, // Nodemailer or CustomMail
    senderAccount: { type: String, default: 'noreply@samprasrealty.com' },
    appPassword: { type: String, default: '' } // Encrypted or plaintext depending on security needed, but for now we'll just store it.
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
