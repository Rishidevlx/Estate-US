const Settings = require('../models/Settings');

// Get Settings (singleton)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// Update Settings
exports.updateSettings = async (req, res) => {
  try {
    const { publicInfo, mailConfig } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    if (publicInfo) {
      settings.phone = publicInfo.phone || settings.phone;
      settings.email = publicInfo.email || settings.email;
      settings.address = publicInfo.address || settings.address;
      settings.mapLocation = publicInfo.mapLocation || settings.mapLocation;
      settings.facebook = publicInfo.facebook || settings.facebook;
      settings.twitter = publicInfo.twitter || settings.twitter;
      settings.instagram = publicInfo.instagram || settings.instagram;
      settings.linkedin = publicInfo.linkedin || settings.linkedin;
      settings.logo = publicInfo.logo || settings.logo;
    }
    
    if (mailConfig) {
      settings.mailConfig = {
        recipientEmail: mailConfig.recipientEmail || settings.mailConfig.recipientEmail,
        serviceProvider: mailConfig.serviceProvider || settings.mailConfig.serviceProvider,
        senderAccount: mailConfig.senderAccount || settings.mailConfig.senderAccount,
        appPassword: mailConfig.appPassword || settings.mailConfig.appPassword,
      };
    }

    await settings.save();
    res.status(200).json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};
