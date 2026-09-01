const Blog = require('../models/Blog');

// Create or Draft a Blog
exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(400).json({ error: 'Failed to create blog' });
  }
};

// Get all blogs (with optional filters)
exports.getBlogs = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Sort by newest first
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Server error fetching blogs' });
  }
};

// Get single blog by ID or Slug
exports.getBlogById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let blog;

    // Try finding by slug first
    blog = await Blog.findOne({ slug: identifier });

    // If not found by slug, and it's a valid ObjectId, try finding by ID
    if (!blog && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(identifier);
    }

    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBlog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json(updatedBlog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(400).json({ error: 'Failed to update blog' });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
