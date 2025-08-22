const express = require('express');
const router = express.Router();
const rapportController = require('../controllers/rapport.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../middleware/multer.middleware');

const verifyOwnership = require('../middleware/verifyStageOwnership.middleware');
const  verifyOwnershipOr = require('../middleware/VerifyOwnershipOr.middleware');
const { Stage ,Stagiaire } = require('../models');

router.post(
  '/rapport/add/:id',
  authMiddleware,
  roleMiddleware('stagiaire'),
  verifyOwnership(Stage, Stagiaire,"stagiare"),
  upload.single('fichier'),
  rapportController.addRapport
);

router.get('/rapport/:id', authMiddleware,roleMiddleware('encadrant','stagiaire'),verifyOwnershipOr,rapportController.getRapportByStageId);

module.exports = router;