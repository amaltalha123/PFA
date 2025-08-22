const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../middleware/multer.middleware');
const verifyOwnership = require('../middleware/verifyStageOwnership.middleware');
const verifyTicketOwnership = require('../middleware/VerifyTicketOwnership.middleware');
const { Stage ,Stagiaire,ticket,Encadrant } = require('../models');

const verifyCollectionOwnership = require('../middleware/VerifyCollectionOwnershipOr.middleware');

router.post(
  '/ticket/add/:id',
  authMiddleware,
  roleMiddleware('stagiaire'), 
  verifyOwnership(Stage, Stagiaire,"stagiare"),
  upload.single('piece_jointe'),
  ticketController.addTicket
);

router.delete('/ticket/delete/:id', authMiddleware, roleMiddleware('stagiaire'), verifyTicketOwnership(ticket,Stagiaire,Stage,"stage","stagiare"), ticketController.deleteticket);
router.put('/ticket/update/:id', 
  authMiddleware, 
  roleMiddleware('stagiaire'), 
  upload.single('piece_jointe'), 
  verifyTicketOwnership(ticket, Stagiaire, Stage, "stage", "stagiare"), 
  ticketController.updateTicket
);
router.get('/ticket/all/:id', authMiddleware,roleMiddleware('encadrant','stagiaire'),verifyCollectionOwnership(ticket), ticketController.getTicketsByStageId);
router.put('/ticket/addComment/:id', authMiddleware,roleMiddleware('encadrant'),verifyTicketOwnership(ticket,Encadrant,Stage,"stage","encadrant"), ticketController.ticketAddComment);

module.exports = router;
