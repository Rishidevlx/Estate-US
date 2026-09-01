const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, slug, status } = req.body;
    const lastCat = await Category.findOne().sort({ order: -1 });
    const order = lastCat ? lastCat.order + 1 : 0;
    
    const category = new Category({ name, slug, status, order });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, slug, status } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, status },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};

exports.reorderCategories = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const updatePromises = orderedIds.map((id, index) => 
      Category.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updatePromises);
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering categories', error });
  }
};
