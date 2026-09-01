const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  reorderCategories 
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', addCategory);
router.put('/reorder', reorderCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
