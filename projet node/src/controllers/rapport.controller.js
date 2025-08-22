const { Stage, Rapport} = require('../models'); 
const path = require('path');
exports.addRapport = async (req, res) => {
  const stageId = req.params.id; 
  const { contenue } = req.body;

  try {
    const stage = await Stage.findByPk(stageId);

    const now = new Date();
    const dateFin = new Date(stage.date_fin);
    const dateLimite = new Date(dateFin);
    dateLimite.setDate(dateFin.getDate() + 3); 

    if (now < dateFin) {
      return res.status(400).json({
        success: false,
        message: "Le rapport ne peut être soumis qu'après la fin du stage.",
      });
    }

    if (now > dateLimite) {
      return res.status(400).json({
        success: false,
        message: "Le délai de soumission du rapport est dépassé (3 jours après la fin du stage).",
      });
    }


    const existingRapport = await Rapport.findOne({ where: { stage_id: stageId } });
    if (existingRapport) {
      return res.status(409).json({
        success: false,
        message: "Un rapport existe déjà pour ce stage.",
        data: null
      });
    }
    const rapport = await Rapport.create({
    contenue:contenue,
    fichier: req.file.path, 
    stage_id: stage.id
    });

    return res.status(200).json({
      success: true,
      message: "Rapport ajouté avec succès.",
      data: {
        contenue: rapport.contenue,
        fichier: rapport.fichier 
        ? `${req.protocol}://${req.get('host')}/${rapport.fichier.replace(/\\/g, '/')}`
        : null,
        createdAt:rapport.createdAt

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

exports.getRapportByStageId = async (req, res) =>{
  const stageId = req.params.id;

  try {
    const rapports = await Rapport.findAll({
      where: { stage_id: stageId }
    });

    const formattedrapports = rapports.map(t => ({
      id: t.id,
      contenue: t.contenue,
      fichier: t.fichier 
        ? `${req.protocol}://${req.get('host')}/${t.fichier.replace(/\\/g, '/')}`
        : null,
      createdAt:t.createdAt
    }));

    return res.status(200).json({
      success: true,
      message: "rapports du stage récupérés avec succès.",
      data: formattedrapports
    });

  } catch (error) {
    console.error("Erreur récupération rapports par stage :", error);
    res.status(500).json({
      success: false,
      message: "Rapport non trouvé",
      data: null
    });
  }
}