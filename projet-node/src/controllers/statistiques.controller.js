const { User,Rapport, evaluationRapport,document,Evaluation,Stage,Encadrant, Stagiaire, ticket,Departement,mission } = require('../models');
const { Op } = require('sequelize');


const getTotalStagiaires = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'stagiaire' },
      include: [Stagiaire] // Inclure Stagiaire ici
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const processedUsers = users.map(user => {
      const plainUser  = user.get({ plain: true });
      const stagiaire = plainUser .Stagiaire; // Récupérer directement depuis plainUser 

      return {
        ...plainUser ,
        Stagiaire: stagiaire ? {
          ...stagiaire,
          cv: stagiaire.cv 
            ? `${baseUrl}/${stagiaire.cv.replace(/\\/g, '/')}` 
            : null,
          lettre_motivation: stagiaire.lettre_motivation
            ? `${baseUrl}/${stagiaire.lettre_motivation.replace(/\\/g, '/')}`
            : null
        } : null
      };
    });

    return res.status(200).json({ 
      success: true,
      stagiaires: processedUsers,
      totalStagiaires: processedUsers.length
    });
  } catch (error) {
    console.error("Erreur :", error);
    return res.status(500).json({ 
      success: false,
      message: "Erreur serveur"
    });
  }
};



const getTotalEncadrant = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'encadrant' },
      include: [
        {
          model: Encadrant,
          include: [Departement] // Inclure le modèle Department
        }
      ]
    });

   const processedUsers = users.map(user => {
  const encadrantData = user.Encadrant;

  return {
    ...user.toJSON(), // convertir l'instance Sequelize en objet JS simple
    Encadrant: encadrantData
      ? {
          id: encadrantData.id,
          specialite: encadrantData.specialite,
          Departement: encadrantData.Departement || null
        }
      : null
  };
});

    return res.status(200).json({ 
      success: true,
      encadrant: processedUsers,
      totalEncadrants: processedUsers.length
    });
   
  } catch (error) {
    console.error("Erreur lors du comptage des encadrants :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};



const getTotalfinishedStage = async (req, res) => {
  try {

    const today = new Date();

   const stages = await Stage.findAll({
    where: {
        date_fin: {
        [Op.gte]: today  
        }
    },
    include: [
        {
        model: Rapport,
        include: [evaluationRapport]  
        },
        Evaluation,
        document
    ]
    });


    return res.status(200).json({ success: true, stages:stages, totalStages: stages.length });
  } catch (error) {
    console.error("Erreur lors de la récupération des stages en cours :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

const getTotalActualStage = async (req, res) => {
  try {
    const today = new Date();
    const stages = await Stage.findAll({
    where: {
        date_fin: {
        [Op.lte]: today  
        }
    }
    });


    return res.status(200).json({ success: true, stagesActuel:stages, totalActualStage: stages.length});
  } catch (error) {
    console.error("Erreur lors de la récupération des stages en cours :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

const getTotalEncadrantOwnStage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Encadrant }]
    });

    if (!user || !user.Encadrant) {
      return res.status(404).json({ success: false, message: "Encadrant introuvable pour cet utilisateur." });
    }

    const stages = await Stage.findAll({
      where: { encadrant_id: user.Encadrant.id },
      include: [{ model: Stagiaire, include: [User ] }]
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const processedStages = stages.map(stage => {
      let status = "en cours";
      if (stage.date_fin) {
        const dateFin = new Date(stage.date_fin);
        const today = new Date();
        if (dateFin <= today) {
          status = "terminé";
        }
      }
      const plainStage = stage.get({ plain: true });
      const stagiaire = plainStage.Stagiaire; 

      return {
        ...plainStage,
        Stagiaire: stagiaire ? {
          ...stagiaire, 
          cv: stagiaire.cv 
            ? `${baseUrl}/${stagiaire.cv.replace(/\\/g, '/')}` 
            : null,
          lettre_motivation: stagiaire.lettre_motivation
            ? `${baseUrl}/${stagiaire.lettre_motivation.replace(/\\/g, '/')}`
            : null
        } : null,
        status: status
      };
    });

    return res.status(200).json({ success: true, stages: processedStages, totalStage: stages.length });
  } catch (error) {
    console.error("Erreur lors de la récupération des stages en cours :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
}

const getTotalStagiaireOwnStage = async (req, res) => {
 try{
    const userId = req.user.id;
    const user = await User.findOne({
    where: { id: userId },
    include: [{ model: Stagiaire }]
    });
    
    if (!user || !user.Stagiaire) {
      return res.status(404).json({ success: false, message: "Encadrant introuvable pour cet utilisateur." });
    }

    const stages = await Stage.findAll({
      where: { stagiare_id: user.Stagiaire.id },
      include: [{ model: Stagiaire }]
    });

    return res.status(200).json({ success: true, stages:stages, totalStage: stages.length});
 } catch(error) {
        console.error("Erreur lors de la récupération des stages en cours :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
 }
}

const getNonCommentedTicketsNumber = async (req, res) => {
 try{
    const stageId = req.params.id; 
    const stage= await Stage.findByPk(stageId);
    if(!stage){
      return res.status(403).json({ success: true, message:"stage introuvable"});
    }
    const tickets = await ticket.findAll({
      where: { commentaire_encadrant: null ,stage_id:stageId}
    });

    return res.status(200).json({ success: true, tickets:tickets, totaltickets: tickets.length});
 } catch(error) {
        console.error("Erreur lors de la récupération des stages en cours :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
 }
}
const StageByType = async (req, res) => {
  try {
    const stages = await Stage.findAll(); // Récupérer tous les stages

    // Utiliser reduce pour compter les stages par type
    const processedStages = stages.reduce((acc, stage) => {
      const type = stage.type_stage; // Assurez-vous que 'type' est la bonne propriété

      // Vérifier si le type existe déjà dans l'accumulateur
      if (!acc[type]) {
        acc[type] = { type: type, count: 0 }; // Initialiser le type et le compteur
      }
      acc[type].count += 1; // Incrémenter le compteur pour ce type

      return acc;
    }, {});

    // Convertir l'objet en tableau
    const result = Object.values(processedStages);

    return res.status(200).json({ success: true, StageByType: result });
  } catch (error) {
    console.error("Erreur lors de la récupération des stages en cours :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// Exemple de fonction pour déterminer le type de stage
const determineStageType = (stage) => {
  
  if (stage.type === 'PFA') {
    return 'PFA';
  } else if (stage.type === 'PFE') {
    return 'PFE';
  } else if(stage.type == 'initiation') {
    return 'initiation'; 
  }
};

const getTotalStagiaireOwnStages = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: { id: userId },
      include: [{ 
        model: Stagiaire 
      }]
    });

    if (!user || !user.Stagiaire) {
      return res.status(404).json({ success: false, message: "Encadrant introuvable pour cet utilisateur." });
    }

    const stages = await Stage.findAll({
      where: { stagiare_id: user.Stagiaire.id },
      include: [{ 
        model: Encadrant, 
        include: [
          { 
            model: User,
            attributes: { exclude: ['password'] } // Exclude the password field
          },
          { 
            model: Departement 
          }
        ] 
      }]
    });

    const processedStages = stages.map(stage => {
      let status = "en cours";
      if (stage.date_fin) {
        const dateFin = new Date(stage.date_fin);
        const today = new Date();
        if (dateFin <= today) {
          status = "terminé";
        }
      }
      const plainStage = stage.get({ plain: true });

      return {
        ...plainStage,
        status: status
      };
    });

    return res.status(200).json({ success: true, stages: processedStages, totalStage: stages.length });
  } catch (error) {
    console.error("Erreur lors de la récupération des stages en cours :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
}

const getIncompleteMissions  =async (req, res) =>{
try{
    const stageId = req.params.id; 
    const stage= await Stage.findByPk(stageId);
    if(!stage){
      return res.status(403).json({ success: true, message:"stage introuvable"});
    }
    const missions = await mission.findAll({
      where: { done:false ,stage_id:stageId}
    });

    return res.status(200).json({ success: true, missions:missions, totalmissions: missions.length});
 } catch(error) {
       
        return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
 }
}

module.exports = {getIncompleteMissions,getTotalStagiaires,getTotalEncadrant,getTotalActualStage,getTotalfinishedStage,getTotalEncadrantOwnStage,getNonCommentedTicketsNumber,StageByType,getTotalStagiaireOwnStages}