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

router.post('/register/user/stagiaire',authMiddleware, roleMiddleware('admin'),upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettre_motivation', maxCount: 1 }
  ]),registerController.addStagiaire);

router.post('/register/user/encadrant',authMiddleware, roleMiddleware('admin'),registerController.addEncadrant);

module.exports = router;