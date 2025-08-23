const { Stagiaire, Evaluation,Stage } = require('../models');
const NoteValidator = require('../services/noteValidator.services');

const ajouterEvaluation = async (req, res) => {
const Stage_id = req.params.id;  
  const {
    ponctualite,
    autonomie,
    integration,
    qualite_travaille
  } = req.body;

  const invalidFields = NoteValidator.validateEvaluationStagiaireFields({
    ponctualite,
    autonomie,
    integration,
    qualite_travaille
  });

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: 'Les champs suivants doivent être des entiers entre 0 et 5 :',
      champs_invalides: invalidFields
    });
  }

  try {
    const stage = await Stage.findByPk(Stage_id);
    if (!stage) {
    return res.status(404).json({ message: "Stage non trouvé" });
    }

    const stagiaire = await Stagiaire.findByPk(stage.stagiare_id);
    if (!stagiaire) {
    return res.status(404).json({ message: "Stagiaire non trouvé" });
    }

    
    const now = new Date();
    const dateFin = new Date(stage.date_fin);
    const dateLimite = new Date(dateFin);
    dateLimite.setDate(dateFin.getDate() + 5); 

    if (now > dateLimite) {
      return res.status(400).json({
        success: false,
        message: "Le délai de soumission de l'évaluation est dépassé (5 jours après la fin du stage).",
      });
    }else if(now < dateFin){
        return res.status(400).json({
        success: false,
        message: "il faut mettre l'evaluation après la fin du stage.",
      });
    }

    const existingEvaluation = await Evaluation.findOne({ where: { stage_id: stage.id } });
    if (existingEvaluation) {
    return res.status(409).json({ message: "Une évaluation existe déjà pour ce Stage" });
    }

    const evaluation = await Evaluation.create({
    stage_id: stage.id,
    ponctualite,
    autonomie,
    integration,
    qualite_travaille
    });


    res.status(201).json({ success:true,message: "Évaluation ajoutée avec succès", evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,message: "Erreur serveur", error: error.message });
  }
};


const voirEvaluation = async (req, res) => {
  const Stage_id = req.params.id;

  try {
    const evaluation = await Evaluation.findOne({
      where: { stage_id : Stage_id },
      include: [{
        model: Stage,
        attributes: []
      }]
    });

    if (!evaluation) {
      return res.status(404).json({success:false, message: "Aucune évaluation trouvée pour ce Stage" });
    }

    res.status(200).json({
      success:true,
      message: "Évaluation récupérée avec succès.",
      evaluation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l’évaluation:', error);
    res.status(500).json({
      success:false,
      message: "Erreur serveur lors de la récupération de l’évaluation.",
      error: error.message
    });
  }
};


module.exports = {
  ajouterEvaluation,
  voirEvaluation,
};
