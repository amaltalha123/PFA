const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stage.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const checkStageExists = require('../middleware/checkStageExists.middleware'); 


router.post('/stage/add', authMiddleware, roleMiddleware('admin'),checkStageExists,stageController.addStage);
router.get('/stage/all', authMiddleware, roleMiddleware('admin'),stageController.getAllStage);
router.get('/stage/documents/:id',authMiddleware,roleMiddleware('admin'),stageController.getStageDocuments);
module.exports = router;
