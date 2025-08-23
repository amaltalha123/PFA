const express = require('express');
const router = express.Router();
const { ajouterEvaluation,voirEvaluation  } = require('../controllers/evaluationRapport.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');


router.post('/evaluations/rapport/add/:id',authMiddleware, roleMiddleware('encadrant'),  ajouterEvaluation);
router.get('/evaluations/rapport/get/:id',authMiddleware, roleMiddleware('encadrant','stagiaire'), voirEvaluation);

module.exports = router;
