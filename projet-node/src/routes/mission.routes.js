const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missions.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const missionUpdateMiddleware = require('../middleware/updateMission.middleware');
const verifyOwnership = require('../middleware/verifyStageOwnership.middleware');
const verifyTicketOwnership = require('../middleware/VerifyTicketOwnership.middleware');
const verifyCollectionOwnership = require('../middleware/VerifyCollectionOwnershipOr.middleware');

const { Stage ,Encadrant,mission,Stagiaire } = require('../models');

router.post('/mission/add/:id', authMiddleware, roleMiddleware('encadrant'), verifyOwnership(Stage, Encadrant,"encadrant"), missionController.addMission);
router.delete('/mission/delete/:id/:idStage', authMiddleware, roleMiddleware('encadrant'),verifyTicketOwnership(mission, Encadrant, Stage, "stage", "encadrant"), missionController.deleteMission);
router.put('/mission/update/:id/:idStage', authMiddleware, roleMiddleware('encadrant'),verifyTicketOwnership(mission, Encadrant, Stage, "stage", "encadrant"),missionUpdateMiddleware, missionController.updateMission);
router.get('/mission/all/:id', authMiddleware,roleMiddleware('encadrant','stagiaire'),verifyCollectionOwnership(mission), missionController.getMissionsByStage);

router.put('/mission/done/:id/:idStage',authMiddleware,roleMiddleware('stagiaire'),verifyTicketOwnership(mission, Stagiaire, Stage, "stage", "stagiare"),missionController.missionDone);
module.exports = router;
