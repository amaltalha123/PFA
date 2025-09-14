const { Stage,Stagiaire,Encadrant,User,Departement,document,Rapport} = require('../models');
const Joi = require('joi');

const stageSchema = Joi.object({
      stagiare_id: Joi.number().integer().required(),
      encadrant_id: Joi.number().integer().required(),
      date_debut: Joi.date().required(),
      date_fin: Joi.date().required(),
      sujet: Joi.string().required().allow(''),
      type_stage: Joi.string().valid('initiation', 'PFA', 'PFE').required()
});

exports.addStage = async (req, res) => {
  try {

    const { error, value } = stageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { stagiare_id, encadrant_id, date_debut, date_fin, sujet, type_stage } = value;

    const stagiaire = await Stagiaire.findOne({where: {id: stagiare_id}});
    // Récupérer l'encadrant avec son département
    const encadrant = await Encadrant.findOne({
      where: { id: encadrant_id },
      include: [{ model: Departement }]
    });

    if(!stagiaire || !encadrant){
      return res.status(400).json({ success:false, message: "Vérifier les pramètres fournies" });
    }
    const departement = encadrant.Departement;
    if (!departement) {
      return res.status(400).json({ success: false, message: "Département introuvable." });
    }
    // Activer le département s'il n'est pas déjà activé
    if (departement.etat==='archivé') {
      departement.etat = 'activé';
      await departement.save();
    }

    const nouveauStage = await Stage.create({
      stagiare_id,
      encadrant_id,
      date_debut,
      date_fin,
      sujet,
      type_stage
    });

    return res.status(201).json({ success:true ,message: "Stage ajouté avec succès.", stage: nouveauStage });
  } catch (err) {
    console.error("Erreur lors de l'ajout du stage :", err);
    return res.status(500).json({ success:false,message: "Erreur serveur." });
  }
};


exports.modifyStage = async (req, res) => {
  try {
    const stageId = req.params.id;
    const existingStage=await Stage.findByPk(stageId);
    if(!existingStage){
      return res.status(400).json({ success:false, message: "Vérifier les pramètres fournies" });
    }
    const { error, value } = stageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { stagiare_id, encadrant_id, date_debut, date_fin, sujet, type_stage } = value;

    const stagiaire = await Stagiaire.findOne({where: {id: stagiare_id}});
    // Récupérer l'encadrant avec son département
    const encadrant = await Encadrant.findOne({
      where: { id: encadrant_id },
      include: [{ model: Departement }]
    });

    if(!stagiaire || !encadrant){
      return res.status(400).json({ success:false, message: "Vérifier les pramètres fournies" });
    }
    const departement = encadrant.Departement;
    if (!departement) {
      return res.status(400).json({ success: false, message: "Département introuvable." });
    }
   

    try {
      existingStage.stagiare_id = stagiare_id;
      existingStage.encadrant_id = encadrant_id;
      existingStage.sujet= sujet;
      existingStage.date_debut=date_debut;
      existingStage.date_fin=date_fin;
      existingStage.type_stage=type_stage;

      await existingStage.save();
    } catch (saveError) {
      console.error("Erreur lors de la sauvegarde :", saveError);
      return res.status(500).json({
        success: false,
        errorCode: "SAVE_ERROR",
        message: "Impossible de sauvegarder les modifications",
        data: null
      });
    }
    const stages = await Stage.findOne({where:{id:stageId},
      include: [
        {
          model: Stagiaire,
          include: [User]
        },
        {
          model: Encadrant,
          include: [User,Departement],
          
        }
      ]
    });
    let status = "en cours";
      if (stages.date_fin && stages.date_debut) {
        const dateFin = new Date(stages.date_fin);
        const dateDebut= new Date(stages.date_debut);
        const today = new Date();
        if (dateFin <= today) {
          status = "terminé";
        }else if(dateDebut>today){
          status="en attente";
        }
      }
    const plainStage = stages.get({ plain: true });

    return res.status(201).json({
      success: true,
      message: "Stage modifié avec succès.",
      stage: { ...plainStage, status: status }
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout du stage :", err);
    return res.status(500).json({ success:false,message: "Erreur serveur." });
  }
};

exports.getAllStage = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Récupérer tous les stages avec stagiaire (et user) + encadrant (et user)
    const stages = await Stage.findAll({
      include: [
        {
          model: Stagiaire,
          include: [User]
        },
        {
          model: Encadrant,
          include: [User,Departement],
          
        }
      ]
    });

    const assignments = stages.map(stage => {
      // Calcul du status
      let status = "en cours";
      if (stage.date_fin) {
        const dateFin = new Date(stage.date_fin);
        const today = new Date();
        if (dateFin <= today) {
          status = "terminé";
        }
      }

      // Récupération stagiaire + ajout des chemins pour CV et lettre
      const stagiaire = stage.Stagiaire
        ? {
            ...stage.Stagiaire.toJSON(),
            cv: stage.Stagiaire.cv
              ? `${baseUrl}/${stage.Stagiaire.cv.replace(/\\/g, "/")}`
              : null,
            lettre_motivation: stage.Stagiaire.lettre_motivation
              ? `${baseUrl}/${stage.Stagiaire.lettre_motivation.replace(/\\/g, "/")}`
              : null
          }
        : null;

      return {
        ...stage.toJSON(),
        Stagiaire: stagiaire,
        status
      };
    });

    return res.status(200).json({ success: true, assignments });

  } catch (err) {
    console.error("Erreur lors de la récupération :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

exports.getAllStages = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const user = req.user;

    // Préparer les options de la requête Sequelize
    let whereStage = {};

    if (user.role === 'admin') {
      // Admin voit tout, pas de filtre
    } else if (user.role === 'encadrant') {
      const encadrant = await Encadrant.findOne({where:{user_id: user.id}});
      whereStage = {
        etat: 'activé',
        encadrant_id: encadrant.id
      };
    } else if (user.role === 'stagiaire') {
      const stagiaire = await Stagiaire.findOne({where:{user_id: user.id}});
      whereStage = {
        etat: 'activé',
        stagiare_id: stagiaire.id  
      };
    } else {
      return res.status(403).json({ success: false, message: "Accès refusé." });
    }


    // Récupérer les stages avec les filtres
    const stages = await Stage.findAll({
      where: whereStage,
      include: [
        {
          model: Stagiaire,
          include: [User]
        },
        {
          model: Encadrant,
          include: [User,Departement],
          
        }
      ]
    });
    

    const assignments = stages.map(stage => {
      // Calcul du status
      let status = "en cours";
      if (stage.date_fin && stage.date_debut) {
        const dateFin = new Date(stage.date_fin);
        const dateDebut= new Date(stage.date_debut);
        const today = new Date();
        if (dateFin <= today) {
          status = "terminé";
        }else if(dateDebut>today){
          status="en attente";
        }
      }

      // Récupération stagiaire + ajout des chemins pour CV et lettre
      const stagiaire = stage.Stagiaire
        ? {
            ...stage.Stagiaire.toJSON(),
            cv: stage.Stagiaire.cv
              ? `${baseUrl}/${stage.Stagiaire.cv.replace(/\\/g, "/")}`
              : null,
            lettre_motivation: stage.Stagiaire.lettre_motivation
              ? `${baseUrl}/${stage.Stagiaire.lettre_motivation.replace(/\\/g, "/")}`
              : null
          }
        : null;

      return {
        ...stage.toJSON(),
        Stagiaire: stagiaire,
        status
      };
    });

    return res.status(200).json({ success: true, assignments ,totalStage: assignments.length});

  } catch (err) {
    console.error("Erreur lors de la récupération :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

exports.getStageDocuments= async(req,res)=>{

  const stageId = req.params.id;
  const stage = await Stage.findOne({
  where: { id: stageId },
  include: [
    { model: document },
    { model: Rapport }
  ]
  });

  if (!stage) {
    return res.status(404).json({ success: false, message: "Stage non trouvé" });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const documentData = stage.document
    ? {
        ...stage.document.toJSON(),
        document_evaluation: stage.document.document_evaluation
          ? `${baseUrl}/${stage.document.document_evaluation.replace(/\\/g, "/")}`
          : null,
        document_attestation: stage.document.document_attestation
          ? `${baseUrl}/${stage.document.document_attestation.replace(/\\/g, "/")}`
          : null
      }
    : null;

  const rapportData = stage.Rapport
    ? {
        ...stage.Rapport.toJSON(),
        fichier: stage.Rapport.fichier
          ? `${baseUrl}/${stage.Rapport.fichier.replace(/\\/g, "/")}`
          : null
      }
    : null;

  return res.status(200).json({
    success: true,
    documents:{
    Document: documentData,
    Rapport: rapportData}
  }); 

}

exports.archiverStage = async (req, res) => {
  const stageId = req.params.id;
  try {
    // 1. Chercher le stage par son id
    const stage = await Stage.findByPk(stageId);
    if (!stage) {
      return res.status(404).json({ success: false, message: "Stage non trouvé." });
    }

    // 2. Récupérer l'encadrant lié au stage avec son département
    const encadrant = await Encadrant.findByPk(stage.encadrant_id);
    if (!encadrant) {
      return res.status(404).json({ success: false, message: "Encadrant non trouvé." });
    }

    const departement = await Departement.findByPk(encadrant.departement_id);
    if (!departement) {
      return res.status(404).json({ success: false, message: "Département non trouvé." });
    }

    // 3. Archiver le stage ciblé
    stage.etat = 'archivé';
    await stage.save();

    // 4. Récupérer tous les encadrants du même département
    const encadrants = await Encadrant.findAll({
      where: { departement_id: departement.id }
    });
    const encadrantIds = encadrants.map(e => e.id);

    // 5. Récupérer tous les stages liés à ces encadrants
    const stages = await Stage.findAll({
      where: {
        encadrant_id: encadrantIds
      }
    });

    // 6. Vérifier si tous les stages sont archivés
    const tousArchives = stages.every(s => s.etat === 'archivé');

    // 7. Archiver le département si tous les stages sont archivés, sinon le laisser activé
    if (tousArchives && departement.etat !== 'archivé') {
      departement.etat = 'archivé';
      await departement.save();
    } else if (!tousArchives && departement.etat !== 'activé') {
      departement.etat = 'activé';
      await departement.save();
    }

    res.status(200).json({
      success: true,
      message: "Stage archivé avec succès.",
      data: stage,
      departementEtat: departement.etat
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de l'archivage du stage." });
  }
};


exports.activerStage = async (req, res) => {
  const stageId = req.params.id;
  try {
    // 1. Chercher le stage par son id
    const stage = await Stage.findByPk(stageId);
    if (!stage) {
      return res.status(404).json({ success: false, message: "Stage non trouvé." });
    }

    // 2. Récupérer l'encadrant lié au stage avec son département
    const encadrant = await Encadrant.findByPk(stage.encadrant_id);
    if (!encadrant) {
      return res.status(404).json({ success: false, message: "Encadrant non trouvé." });
    }

    const departement = await Departement.findByPk(encadrant.departement_id);
    if (!departement) {
      return res.status(404).json({ success: false, message: "Département non trouvé." });
    }

    // 3. Activer le stage ciblé
    stage.etat = 'activé';
    await stage.save();

   
    // 5. Activer le département si au moin un stage est activé
    if (departement.etat == 'archivé') {
      departement.etat = 'activé';
      await departement.save();
    } 

    res.status(200).json({
      success: true,
      message: "Stage activé avec succès.",
      data: stage,
      departementEtat: departement.etat
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de l'archivage du stage." });
  }
};


