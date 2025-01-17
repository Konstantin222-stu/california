const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', subcategoryController.getSubcategories);
router.post('/', upload.single('image'), subcategoryController.createSubcategory);
router.put('/:id', subcategoryController.upload.single('image'), subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);


module.exports = router;



