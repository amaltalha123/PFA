const express = require('express');
const router = express.Router();
const encadrantController = require('../controllers/encadrant.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/encadrants', authMiddleware, roleMiddleware('admin'), encadrantController.getAllEncadrants);

module.exports = router;
