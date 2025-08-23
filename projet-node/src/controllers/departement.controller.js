const { Departement } = require('../models');

exports.addDepartement = async (req, res) => {
  const { nom } = req.body;

  try {
    // Validation
    if (!nom || nom.trim() === "") {
      return res.status(400).json({
        success: false,
        errorCode: "DEPARTMENT_NAME_REQUIRED",
        message: "Le nom du département est requis.",
        data: null
      });
    }

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
        nom: newDepartement.nom
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


exports.deleteDepartement = async (req, res) => {
  const { id } = req.params;

  try {
    const departement = await Departement.findByPk(id);

    if (!departement) {
      return res.status(404).json({
        success: false,
        errorCode: "DEPARTMENT_NOT_FOUND",
        message: "Département introuvable.",
        data: null
      });
    }

    await departement.destroy();

    res.status(200).json({
      success: true,
      message: "Département supprimé avec succès.",
      data: {
        id: departement.id,
        nom: departement.nom
      }
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du département :", error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur serveur lors de la suppression.",
      data: null
    });
  }
};

exports.allDepartements = async (req, res) => {
 
  try {
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


