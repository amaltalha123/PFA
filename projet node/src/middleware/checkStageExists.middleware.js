const { Op } = require('sequelize'); // Ajoutez cette ligne
const { Stage } = require('../models');

const checkStageExists = async (req, res, next) => {
  const { stagiare_id, date_debut, date_fin } = req.body;

  if (!stagiare_id || !date_debut || !date_fin) {
    return res.status(400).json({ success: false, message: "Champs obligatoires manquants." });
  }

  try {
    const existingStage = await Stage.findOne({
      where: {
        stagiare_id,
        date_debut: {
          [Op.lte]: date_fin // La date de début du stage existant doit être avant ou égale à la date de fin du nouveau stage
        },
        date_fin: {
          [Op.gte]: date_debut // La date de fin du stage existant doit être après ou égale à la date de début du nouveau stage
        }
      }
    });

    if (existingStage) {
      return res.status(400).json({ success: false, message: "Un stage existe déjà pour ce stagiaire dans cette période." });
    }

    next(); // Si aucun stage n'existe, passez au contrôleur suivant
  } catch (err) {
    console.error("Erreur lors de la vérification des stages :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

module.exports = checkStageExists;
