const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
  title: { type: String, default: 'Real Estate, Made Simple' },
  description1: { 
    type: String, 
    default: 'At Sampras, we believe the right home starts with the right guidance. We research communities, understand the market, and help you explore opportunities with confidence.' 
  },
  description2: { 
    type: String, 
    default: "Whether you're a first-time home buyer, a young couple, or looking for a new community, our team is here to guide you through every step — from finding the right property to understanding your financing options." 
  },
  quote: { type: String, default: 'Your goals. Our guidance. One step closer to home.' },
  image: { type: String, default: 'https://placehold.co/600x700/f5f7f6/113c2b?text=Founder+Image' }
}, { timestamps: true });

module.exports = mongoose.model('Founder', founderSchema);
