const { Encadrant, User, Departement } = require('../models');

exports.getAllEncadrants = async (req, res) => {
  try {
    const encadrants = await Encadrant.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'nom', 'prenom', 'email']
        },
        {
          model: Departement,
          attributes: ['id', 'nom']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: encadrants
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des encadrants :', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des encadrants."
    });
  }
};
