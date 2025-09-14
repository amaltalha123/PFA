const { Departement,Encadrant,Stage } = require('../models');

const Joi = require('joi');

const departementSchema = Joi.object({
      nom: Joi.string().required(),
    });

exports.addDepartement = async (req, res) => {
  
  try {
    // Validation
    const { error, value } = departementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { nom } = value;
    

    // Vérifie s'il existe déjà
    const existing = await Departement.findOne({ where: { nom } });
    if (existing) {
      return res.status(409).json({
        success: false,
        errorCode: "DEPARTMENT_ALREADY_EXISTS",
        message: `Le département "${nom}" existe déjà.`,
        data: null
      });
    }

    const newDepartement = await Departement.create({ nom });

    res.status(201).json({
      success: true,
      message: "Département ajouté avec succès.",
      data: {
        id: newDepartement.id,
        nom: newDepartement.nom,
        etat:newDepartement.etat,
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout du département :", error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur serveur lors de l'ajout du département.",
      data: null
    });
  }
};

exports.modifyDepartement = async (req, res) => {
  
  try {
     const { id } = req.params;
    // Validation
    const { error, value } = departementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { nom } = value;
    

    // Vérifie s'il existe déjà
    const existing = await Departement.findByPk(id);
    
    
    try {
      existing.nom = nom;
      await existing.save();
    } catch (saveError) {
      console.error("Erreur lors de la sauvegarde :", saveError);
      return res.status(500).json({
        success: false,
        errorCode: "SAVE_ERROR",
        message: "Impossible de sauvegarder les modifications du département.",
        data: null
      });
    }

    res.status(201).json({
      success: true,
      message: "Département ajouté avec succès.",
      data: {
        id:existing.id,
        nom:existing.nom,
        etat:existing.etat,
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout du département :", error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur serveur lors de l'ajout du département.",
      data: null
    });
  }
};


// exports.deleteDepartement = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const departement = await Departement.findByPk(id);

//     if (!departement) {
//       return res.status(404).json({
//         success: false,
//         errorCode: "DEPARTMENT_NOT_FOUND",
//         message: "Département introuvable.",
//         data: null
//       });
//     }

//     await departement.destroy();

//     res.status(200).json({
//       success: true,
//       message: "Département supprimé avec succès.",
//       data: {
//         id: departement.id,
//         nom: departement.nom
//       }
//     });

//   } catch (error) {
//     console.error("Erreur lors de la suppression du département :", error);
//     res.status(500).json({
//       success: false,
//       errorCode: "SERVER_ERROR",
//       message: "Erreur serveur lors de la suppression.",
//       data: null
//     });
//   }
// };

exports.allDepartements = async (req, res) => {
 
  try {

    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Accès refusé. Vous devez être administrateur pour accéder à cette ressource."
      });
    }
    const departements = await Departement.findAll();

    res.status(200).json({
      success: true,
      message: "Département récuppéré avec succès.",
      data: {
        departements:departements,
        total:departements.length
      }
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du département :", error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur serveur lors de la récupération.",
      data: null
    });
  }
};

exports.achiverDepartement = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupérer le département
    const departement = await Departement.findByPk(id);
    if (!departement) {
      return res.status(404).json({
        success: false,
        errorCode: "DEPARTMENT_NOT_FOUND",
        message: "Département introuvable.",
        data: null
      });
    }

    // Récupérer les encadrants du département
    const encadrants = await Encadrant.findAll({
      where: { departement_id: id } // adapter le nom du champ si besoin
    });

    const encadrantIds = encadrants.map(e => e.id);

    // Récupérer les stages liés à ces encadrants
    const stages = await Stage.findAll({
      where: {
        encadrant_id: encadrantIds
      }
    });

    // Archiver les stages trouvés
    await Promise.all(
      stages.map(stage => {
        stage.etat = 'archivé';
        return stage.save();
      })
    );

    // Archiver le département
    departement.etat = 'archivé';
    await departement.save();

    // Réponse
    return res.status(200).json({
      success: true,
      message: "Département et stages associés archivés avec succès.",
      data: {
        departement: {
          id: departement.id,
          nom: departement.nom,
          etat: departement.etat
        },
        nbStagesArchives: stages.length
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'archivage :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'archivage."
    });
  }
};


exports.activerDepartement = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupérer le département
    const departement = await Departement.findByPk(id);
    if (!departement) {
      return res.status(404).json({
        success: false,
        errorCode: "DEPARTMENT_NOT_FOUND",
        message: "Département introuvable.",
        data: null
      });
    }

    // Récupérer les encadrants du département
    const encadrants = await Encadrant.findAll({
      where: { departement_id: id } 
    });

    const encadrantIds = encadrants.map(e => e.id);

    // Récupérer les stages liés à ces encadrants
    const stages = await Stage.findAll({
      where: {
        encadrant_id: encadrantIds
      }
    });

    // Activer les stages trouvés
    await Promise.all(
      stages.map(stage => {
        stage.etat = 'activé';
        return stage.save();
      })
    );

    // activer le département
    departement.etat = 'activé';
    await departement.save();

    // Réponse
    return res.status(200).json({
      success: true,
      message: "Département et stages associés activés avec succès.",
      data: {
        departement: {
          id: departement.id,
          nom: departement.nom,
          etat: departement.etat
        },
        nbStagesArchives: stages.length
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'activation :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'activation."
    });
  }
};
