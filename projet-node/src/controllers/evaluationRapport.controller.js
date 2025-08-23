const { Rapport, evaluationRapport,Stage,Encadrant, Stagiaire } = require('../models');
const NoteValidator = require('../services/noteValidator.services');

const ajouterEvaluation = async (req, res) => {
const rapport_id = req.params.id; 
const userId = req.user.id;


  const {
    presentation_generale,
    stricture_méthodologie,
    contenue_rapport,
    esprit_analyse_synthèse
  } = req.body;

  const invalidFields = NoteValidator.validateEvaluationFields({
    presentation_generale,
    stricture_méthodologie,
    contenue_rapport,
    esprit_analyse_synthèse
  });

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: 'Les champs suivants doivent être des entiers entre 0 et 5 :',
      champs_invalides: invalidFields
    });
  }

  try {
    const rapport = await Rapport.findByPk(rapport_id);
    if (!rapport) {
      return res.status(404).json({ success:false,message: "Rapport non trouvé" });
    }
    const stage = await Stage.findByPk(rapport.stage_id);
    const encadrant = await Encadrant.findOne({where:{user_id: userId}});
    if(stage.encadrant_id != encadrant.id){
      return res.status(404).json({success:false, message: "Role insuffisant !" });
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
    }

    const existingEvaluation = await evaluationRapport.findOne({ where: { rapport_id } });
    if (existingEvaluation) {
      return res.status(409).json({ success:false,message: "Une évaluation existe déjà pour ce rapport" });
    }

    const evaluation = await evaluationRapport.create({
      rapport_id,
      presentation_generale,
      stricture_méthodologie,
      contenue_rapport,
      esprit_analyse_synthèse
    });

    res.status(201).json({ message: "Évaluation ajoutée avec succès", evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


const voirEvaluation = async (req, res) => {
  const rapport_id = req.params.id;
  const userId = req.user.id;
  try {
    const rapport = await Rapport.findByPk(rapport_id);
    if (!rapport) {
      return res.status(404).json({ success:false,message: "Rapport non trouvé" });
    }
    const stage = await Stage.findByPk(rapport.stage_id);

    if(req.user.role==='stagiaire'){
      const stagiaire = await Stagiaire.findOne({where:{user_id: userId}});
      if(stage.stagiare_id != stagiaire.id){
      return res.status(404).json({success:false, message: "Role insuffisant !" });
      }
    }else if(req.user.role==='encadrant'){
      const encadrant = await Encadrant.findOne({where:{user_id: userId}});
      if(stage.encadrant_id != encadrant.id){
      return res.status(404).json({success:false, message: "Role insuffisant !" });
      }
    }
    
  
    const evaluation = await evaluationRapport.findOne({
      where: { rapport_id:rapport_id }
    });

    if (!evaluation) {
      return res.status(404).json({ message: "Aucune évaluation trouvée pour ce rapport." });
    }

    res.status(200).json({
      success:true,
      message: "Évaluation récupérée avec succès.",
      evaluation:evaluation
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
