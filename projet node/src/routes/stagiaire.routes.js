const express = require('express');
const router = express.Router();
const stagiaireController = require('../controllers/stagiaire.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// accessible uniquement aux admins
router.get('/stagiaires', authMiddleware, roleMiddleware('admin'));
router.get('/stagiaires/:id', authMiddleware, stagiaireController.getStagiaire);

module.exports = router;
