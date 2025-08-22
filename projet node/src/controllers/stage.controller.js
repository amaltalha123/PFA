const { Stage,Stagiaire,Encadrant,User,Departement,document,Rapport} = require('../models');

exports.addStage = async (req, res) => {
  try {
    const {
      stagiare_id,
      encadrant_id,
      date_debut,
      date_fin,
      sujet,
      type_stage
    } = req.body;

    if (!stagiare_id || !encadrant_id || !type_stage) {
      return res.status(400).json({ success:false,message: "Champs obligatoires manquants." });
    }

    const stagiaire = await Stagiaire.findOne({where: {id: stagiare_id}});
    const encadrant = await Encadrant.findOne({where : { id: encadrant_id}});
    if(!stagiaire || !encadrant){
      return res.status(400).json({ success:false, message: "Vérifier les pramètres fournies" });
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

