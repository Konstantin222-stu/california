const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }); // Ограничение размера файла до 5 МБ

// В маршруте
router.get('/', deviceController.getAllDevices)
router.get('/:id', deviceController.getDevices)
router.put('/:id', upload.array('images',10), deviceController.updateDevice)
router.post('/', upload.array('images', 10), deviceController.createDevice);
router.delete('/:id', deviceController.deleteDevice)

module.exports = router;