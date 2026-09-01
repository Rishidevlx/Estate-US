const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  metaTitle: { type: String },
  metaDesc: { type: String },
  altText: { type: String },
  image: { type: String },
  attachedFiles: [{ type: String }],
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  author: { type: String, default: 'Admin User' },
  views: { type: Number, default: 0 },
  publishedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
