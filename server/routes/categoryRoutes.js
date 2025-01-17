const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', categoryController.getCategories);
router.get('/:category', categoryController.getCategoryByName);
router.get('/:category/subcategory', categoryController.getSubcategoriesByCategory);
router.get('/:category/brand', categoryController.getBrandsByCategory);
router.post('/', upload.single('video'), categoryController.createCategory);
router.put('/:id', upload.single('video'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
