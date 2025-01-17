const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');
const { checkConnection } = require('../config/db');

// Маршрут для создания нового заказа
router.get('/',checkController.getAllCheck);
router.get('/:id',checkController.getByIdCheck);
router.post('/', checkController.createCheck);
router.put('/:id', checkController.updateCheck);
router.delete('/:id', checkController.deleteCheck);
module.exports = router;