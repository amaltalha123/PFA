const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const userController= require('../controllers/user.controller');

router.delete('/delete/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);

module.exports = router;
