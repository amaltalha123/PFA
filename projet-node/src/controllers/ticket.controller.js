const { Stage, ticket} = require('../models'); 


exports.addTicket = async (req, res) => {
  const stageId = req.params.id; 
  const { Contenue } = req.body;

  try {
    const stage = await Stage.findByPk(stageId);
    
    // Vérifiez si une pièce jointe a été fournie
    const pieceJointePath = req.file ? req.file.path : null; // Utilisez null si aucune pièce jointe n'est fournie

    const Ticket = await ticket.create({
      Contenue,
      piece_jointe: pieceJointePath, // Enregistrez le chemin ou null
      stage_id: stage.id
    });

    return res.status(200).json({
      success: true,
      message: "Ticket ajouté avec succès.",
      data: {
        contenue: Ticket.Contenue,
        piece_jointe: Ticket.piece_jointe,
        commentaire_encadrant: Ticket.commentaire_encadrant,
        updatedAt: Ticket.updatedAt
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout:", error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur serveur lors de l'ajout",
      data: null
    });
  }
};


exports.deleteticket = async (req, res) => {
    const ticketId = req.params.id;
    try {
    const Ticket = await ticket.findByPk(ticketId);
    if (!Ticket){
      return res.status(404).json({ message: "Aucune ticket trouvée" });
    }

   
    await Ticket.destroy();
    return res.status(201).json({
      success: true,
      message: "ticket supprimé avec succès.", 
    });
    
    
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" + error
    });
  }
}

exports.updateTicket = async (req, res) => {
  const ticketId = req.params.id;
  const { Contenue } = req.body;

  try {
    const Ticket = await ticket.findByPk(ticketId);

    if (!Ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket non trouvé."
      });
    }

    if (Ticket.commentaire_encadrant !== null) {
      return res.status(400).json({
        success: false,
        message: "Le ticket ne peut plus être modifié car un commentaire a été ajouté par l'encadrant."
      });
    }

    if (Contenue) Ticket.Contenue = Contenue;

    if (req.file) {
      Ticket.piece_jointe = req.file.path;
    }

    await Ticket.save();

    return res.status(200).json({
      success: true,
      message: "Ticket modifié avec succès.",
      data: {
        contenue: Ticket.Contenue,
        piece_jointe: Ticket.piece_jointe
      }
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour.",
      data: null
    });
  }
};


exports.getTicketsByStageId = async (req, res) => {
  const stageId = req.params.id;

  try {
    const tickets = await ticket.findAll({
      where: { stage_id: stageId }
    });

    const formattedTickets = tickets.map(t => ({
      id: t.id,
      Contenue: t.Contenue,
      piece_jointe: t.piece_jointe 
        ? `${req.protocol}://${req.get('host')}/${t.piece_jointe}`
        : null,
      commentaire_encadrant: t.commentaire_encadrant,
      updatedAt:t.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: "Tickets du stage récupérés avec succès.",
      data: formattedTickets
    });

  } catch (error) {
    console.error("Erreur récupération tickets par stage :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur.",
      data: null
    });
  }
};


exports.ticketAddComment = async (req, res) => {
  const ticketId = req.params.id;
  const { commentaire_encadrant } = req.body; 

  try {
    const Ticket = await ticket.findByPk(ticketId);

    if (!Ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket non trouvé."
      });
    }

    if (Ticket.commentaire_encadrant !== null) {
      return res.status(400).json({
        success: false,
        message: "Le ticket ne peut plus être modifié car un commentaire est déjà ajouté."
      });
    }

    if (commentaire_encadrant) Ticket.commentaire_encadrant = commentaire_encadrant;

    await Ticket.save();

    return res.status(200).json({
      success: true,
      message: "Ticket modifié avec succès.",
      data: {
        contenue: Ticket.Contenue,
        piece_jointe: Ticket.piece_jointe,
        commentaire_encadrant: Ticket.commentaire_encadrant,
        updatedAt:Ticket.updatedAt
      }
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour.",
      data: null
    });
  }
};

