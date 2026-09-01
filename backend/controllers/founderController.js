const Founder = require('../models/Founder');

// Get Founder details (singleton)
exports.getFounder = async (req, res) => {
  try {
    let founder = await Founder.findOne();
    if (!founder) {
      founder = await Founder.create({});
    }
    res.status(200).json(founder);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching founder details', error: error.message });
  }
};

// Update Founder details
exports.updateFounder = async (req, res) => {
  try {
    const { title, description1, description2, quote, image } = req.body;
    let founder = await Founder.findOne();
    
    if (!founder) {
      founder = new Founder();
    }
    
    if (title !== undefined) founder.title = title;
    if (description1 !== undefined) founder.description1 = description1;
    if (description2 !== undefined) founder.description2 = description2;
    if (quote !== undefined) founder.quote = quote;
    if (image !== undefined) founder.image = image;

    await founder.save();
    res.status(200).json({ message: 'Founder details updated successfully', founder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating founder details', error: error.message });
  }
};
