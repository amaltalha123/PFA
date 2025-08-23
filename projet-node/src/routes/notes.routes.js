const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');


const verifyNoteOwnership = require('../middleware/VerifyTicketOwnership.middleware');
const { Stage ,Stagiaire,Notes } = require('../models');

router.post('/notes/add', authMiddleware, roleMiddleware('stagiaire'), notesController.addNote);
router.delete('/notes/delete/:id', authMiddleware, roleMiddleware('stagiaire'), verifyNoteOwnership(Notes,Stagiaire,Stage,"stagiaire","stagiare"), notesController.deleteNote);
router.put('/notes/update/:id', authMiddleware, roleMiddleware('stagiaire'), verifyNoteOwnership(Notes,Stagiaire,Stage,"stagiaire","stagiare"), notesController.updateNote);
router.get('/notes/all', authMiddleware, roleMiddleware('stagiaire'), notesController.getAllNotes);
module.exports = router;
