const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.put('/update', authMiddleware, authController.updateProfile);
router.put('/modifyUser',authMiddleware, authController.modifyUser)
module.exports = router;
