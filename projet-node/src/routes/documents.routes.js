const express = require('express');
const router = express.Router();
const {generateEvaluationPDF,getEvaluationPDF} = require('../controllers/EvaluationPdf.controller');
const {generateAttestationPDF,getAttestationPDF} = require('../controllers/attestationPDF.controller');

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const verifyOwnershipOr = require('../middleware/VerifyOwnershipOr.middleware');

router.post('/evaluations/generate/:id', authMiddleware , roleMiddleware('encadrant'),generateEvaluationPDF );
router.post('/attestation/generate/:id', authMiddleware ,roleMiddleware('admin'), generateAttestationPDF );

router.get('/evaluations/:id', authMiddleware , roleMiddleware('encadrant','stagiaire'),verifyOwnershipOr, getEvaluationPDF );
router.get('/attestation/:id', authMiddleware,roleMiddleware('admin','stagiaire'),verifyOwnershipOr, getAttestationPDF );

module.exports = router;
