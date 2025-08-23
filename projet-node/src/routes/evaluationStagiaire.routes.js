const express = require('express');
const router = express.Router();
const { ajouterEvaluation,voirEvaluation  } = require('../controllers/evaluationStagiaire.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const verifyOwnership = require('../middleware/verifyStageOwnership.middleware');
const { Stage ,Encadrant} = require('../models');

const verifyOwnershipOr = require('../middleware/VerifyOwnershipOr.middleware');


router.post('/evaluations/stagiaire/add/:id',authMiddleware, roleMiddleware('encadrant'), verifyOwnership(Stage, Encadrant,"encadrant"), ajouterEvaluation);
router.get('/evaluations/stagiaire/get/:id',authMiddleware, roleMiddleware('encadrant','stagiaire'),verifyOwnershipOr,voirEvaluation);

module.exports = router;
