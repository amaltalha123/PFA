const express = require('express');
const router = express.Router();
const {getTotalStagiaires,getTotalEncadrant,getTotalActualStage,getTotalfinishedStage,getTotalEncadrantOwnStage,StageByType,getTotalStagiaireOwnStages,getNonCommentedTicketsNumber, getIncompleteMissions} = require('../controllers/statistiques.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');


router.get('/statistic/TotalStagiaires',authMiddleware,roleMiddleware('admin'), getTotalStagiaires);
router.get('/statistic/TotalEncadrant',authMiddleware,roleMiddleware('admin'), getTotalEncadrant);
router.get('/statistic/finishedStage',authMiddleware,roleMiddleware('admin'), getTotalfinishedStage);
router.get('/statistic/encadrant/toutMesStages',authMiddleware,roleMiddleware('encadrant'),getTotalEncadrantOwnStage);
router.get('/statistic/StageByType',authMiddleware,roleMiddleware('admin'),StageByType);
router.get('/statistic/stagiaire/toutMesStages',authMiddleware,roleMiddleware('stagiaire'),getTotalStagiaireOwnStages);

module.exports = router;