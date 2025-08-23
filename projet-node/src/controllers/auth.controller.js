const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User,Encadrant,Stagiaire } = require('../models');
require('dotenv').config(); 

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Mot de passe incorrect" });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: EXPIRES_IN }
    );

    res.cookie('token', token, {
    httpOnly: true,        
    secure: false,          
    sameSite: 'Strict',     
    maxAge: 3600000        
  });
    res.json({ message: "Connexion réussie", Token:token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.getprofile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nom', 'prenom', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let profileData = user.toJSON();

    if (user.role === 'encadrant') {
      const encadrant = await Encadrant.findOne({
        where: { user_id: user.id }
      });

      if (encadrant) {
        profileData = {
          ...profileData,
          specialite: encadrant.specialite,
          departement_id: encadrant.departement_id
        };
      }
    } else if (user.role === 'stagiaire') {
      const stagiaire = await Stagiaire.findOne({
        where: { user_id: user.id }
      });

        profileData = {
          ...profileData,
          ecole: stagiaire.ecole,
          filiere: stagiaire.filiere,
          niveau: stagiaire.niveau,
          lettre_motivation: stagiaire.lettre_motivation
          ? `${req.protocol}://${req.get('host')}/${stagiaire.lettre_motivation}`
          : null,

          cv:stagiaire.cv
          ? `${req.protocol}://${req.get('host')}/${stagiaire.cv}`
          : null,
        };
      
    }

    res.json(profileData);
  } catch (error) {
    console.error("Erreur profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.updateProfile = async (req, res) => {
  const userId = req.user.id; 
  const { password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (password) {
      const bcrypt = require('bcrypt');
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ message: "Profil mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur updateProfile :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.destroy();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.modifyUser= async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

   
  } catch (error) {
    console.error("Erreur  :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

