const { User, Stagiaire } = require('../models'); 


exports.getStagiaire = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user || user.role === 'admin') {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    let profileData = user.toJSON();
    delete profileData.password;
    
    if (user.role === 'stagiaire') {
      const stagiaire = await Stagiaire.findOne({
        where: { user_id: user.id }
      });

      if (stagiaire) {
        profileData = {
          ...profileData,
          ecole: stagiaire.ecole,
          filière: stagiaire.filière,
          niveau: stagiaire.niveau,
          lettre_motivation: stagiaire.lettre_motivation
          ? `${req.protocol}://${req.get('host')}/${stagiaire.lettre_motivation}`
          : null,

          cv:stagiaire.cv
          ? `${req.protocol}://${req.get('host')}/${stagiaire.cv}`
          : null,
        };
      }
    }

    res.json(profileData);
  } catch (error) {
    console.error("Erreur lors de la récupération des stagiaires :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

 