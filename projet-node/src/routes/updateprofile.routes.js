const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../middleware/multer.middleware');

router.put('/update', authMiddleware, authController.updateProfile);
router.patch('/modifyUser/:id',authMiddleware,roleMiddleware('admin'),upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettre_motivation', maxCount: 1 }
  ]), authController.modifyUser)
module.exports = router;
