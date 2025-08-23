const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../middleware/multer.middleware');

router.post('/register',authMiddleware, roleMiddleware('admin'), upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettre_motivation', maxCount: 1 }
  ]),registerController.register);

module.exports = router;