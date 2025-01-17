const express = require('express');
const router = express.Router();
const imagesDeviceController = require('../controllers/imagesDeviceController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }); 

// Маршрут для создания нового заказа
router.get('/',imagesDeviceController.getAllImages);
router.get('/:id',imagesDeviceController.getImageByDevice);
router.post('/', upload.array('images', 10), imagesDeviceController.addImages);
router.put('/:id', upload.single('image'), imagesDeviceController.updateImages);
router.delete('/:id', imagesDeviceController.deleteImages);
module.exports = router;