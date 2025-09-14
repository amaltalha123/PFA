const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stage.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const checkStageExists = require('../middleware/checkStageExists.middleware'); 


router.post('/stage/add', authMiddleware, roleMiddleware('admin'),checkStageExists,stageController.addStage);
router.get('/stage/all', authMiddleware,roleMiddleware('admin','stagiaire','encadrant'), stageController.getAllStages);
router.get('/stage/documents/:id',authMiddleware,roleMiddleware('admin'),stageController.getStageDocuments);

router.patch('/stage/archiver/:id',authMiddleware,roleMiddleware('admin'), stageController.archiverStage);
router.patch('/stage/activer/:id',authMiddleware,roleMiddleware('admin'), stageController.activerStage);
router.patch('/stage/modify/:id',authMiddleware,roleMiddleware('admin'), stageController.modifyStage);

module.exports = router;
