const { Op } = require('sequelize');
const { Stage, mission } = require('../models');

const updateMission = async (req, res, next) => {
  const MissionId = req.params.id; 
  const { date_limite } = req.body;

  if (!date_limite) {
    return res.status(400).json({ success: false, message: "Champs obligatoires manquants." });
  }

  try {
    const Mission = await mission.findOne({
      where: { id: MissionId },
      include: [Stage]
    });


    if (!Mission) {
      return res.status(404).json({ success: false, message: "Mission introuvable." });
    }

    const today = new Date(); // date actuelle
    const missionDateLimite = new Date(Mission.date_limite);
    const stageDateFin =new Date(Mission.Stage.date_fin)
    const newDateLimite = new Date(date_limite);

    if (Mission.done === true) {
      return res.status(400).json({ success: false, message: "Vous ne pouvez pas modifier cette mission, elle est déjà terminée." });
    } 
    else if (newDateLimite.getTime()<= missionDateLimite.getTime()) {
      return res.status(400).json({ 
        success: false, 
        message: "Si vous voulez modifier la mission, il faut changer la date limite vers une date suppérieur" 
      });
    } else if (stageDateFin.getTime() < newDateLimite.getTime()) {
      return res.status(400).json({ 
        success: false, 
        message: "Veuillez entrer une date inférieur à la date du fin du stage" 
      });
    } 
    else {
      return next();  
    }
  } catch (err) {
    console.error("Erreur lors de la vérification des modifications :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

module.exports = updateMission;
