const express = require('express');
const router = express.Router();
const departementController = require('../controllers/departement.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.post('/addDepartement',authMiddleware,roleMiddleware('admin'),departementController.addDepartement);

router.patch('/modifyDepartement/:id',authMiddleware,roleMiddleware('admin'),departementController.modifyDepartement);
router.get('/departements/all',authMiddleware,roleMiddleware('admin'),departementController.allDepartements);
//router.delete('/deleteDepartement/:id',authMiddleware, roleMiddleware('admin'), departementController.deleteDepartement);

router.patch('/departements/archiver/:id',authMiddleware,roleMiddleware('admin'), departementController.achiverDepartement);
router.patch('/departements/activer/:id',authMiddleware,roleMiddleware('admin'), departementController.activerDepartement);
module.exports = router;
