const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User,Encadrant,Stagiaire,Departement } = require('../models');
require('dotenv').config(); 
const { sendWelcomeEmail } = require('../services/email.services'); 
const Joi = require('joi');

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const UserSchema = Joi.object({
  nom: Joi.string().required(),
  prenom:Joi.string().required(),
  email: Joi.string().email().required(),
}).min(1);

const StagiaireSchema = UserSchema.concat(Joi.object({
  ecole: Joi.string().required(),
  filiere: Joi.string().required(),
  niveau: Joi.string().required(),
}));


const EncadrantSchema = UserSchema.concat(Joi.object({
  specialite: Joi.string().required(),
  departement: Joi.string().required(),
}));

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const paswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

exports.login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, password } = value;

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
  const { error, value } = paswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { password } = value;

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

const sendEmailToUser= async (email,prenom,password)=>{
 const emailResult = await sendWelcomeEmail(email, prenom,password); 
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          errorCode: "EMAIL_SEND_FAILED",
          message: `Erreur lors de l'envoi de l'email : ${emailResult.error}`
        });
      }
}


exports.modifyUser  = async (req, res) => {
  const userId = req.params.id;

  try {
    // Vérifier que l'utilisateur connecté est admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Accès refusé. Administrateur uniquement." });
    }
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "Encadrant non trouvé." });
    }
    // Selon le rôle, valider et mettre à jour les champs spécifiques
    if (user.role === 'encadrant') {
      // Trouver l'utilisateur
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Encadrant,
            include: [Departement]
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "Encadrant non trouvé." });
      }
      // Valider les champs Encadrant
      const { error: encError, value: encValue } = EncadrantSchema.validate(req.body);
      if (encError) {
        return res.status(400).json({ success: false, message: encError.details[0].message });
      }

      // Si le client a fourni un nom de département, on récupère son ID
      if (encValue.departement) {
        const departement = await Departement.findOne({ where: { nom: encValue.departement } });
        if (!departement) {
          return res.status(400).json({ success: false, message: "Département inconnu." });
        }
        
        encValue.departement_id = departement.id;
        delete encValue.departement; // suppression du champ nom pour éviter conflit
      }
      Object.assign(user, encValue);
      await user.save();

      const encadrant = user.Encadrant;
      if (!encadrant) {
        return res.status(404).json({ success: false, message: "Encadrant non trouvé." });
      }

      const { specialite, departement_id } = encValue;
      if (specialite !== undefined) encadrant.specialite = specialite;
      if (departement_id !== undefined) encadrant.departement_id = departement_id;
      await encadrant.save();
      

    } else if (user.role === 'stagiaire') {
      // Trouver l'utilisateur avec le stagiaire associé
      const user = await User.findByPk(userId, {
        include: [{ model: Stagiaire }]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
      }

      // Valider les champs Stagiaire
      const { error: stagError, value: stagValue } = StagiaireSchema.validate(req.body);
      if (stagError) {
        return res.status(400).json({ success: false, message: stagError.details[0].message });
      }

      // Mettre à jour les champs communs dans user
      Object.assign(user, stagValue);
      await user.save();

      // Mettre à jour les champs spécifiques dans Stagiaire
      const stagiaire = user.Stagiaire;
      if (!stagiaire) {
        return res.status(404).json({ success: false, message: "Stagiaire non trouvé." });
      }

      // Copier les champs spécifiques 
      const { ecole, filiere, niveau } = stagValue;
      if (ecole !== undefined) stagiaire.ecole = ecole;
      if (filiere !== undefined) stagiaire.filiere = filiere;
      if (niveau !== undefined) stagiaire.niveau = niveau;

      // Gérer les fichiers uploadés
      const cvFile = req.files?.cv?.[0];
      const lettreMotivationFile = req.files?.lettre_motivation?.[0];
      if (cvFile) {
        stagiaire.cv = cvFile.path;
      }
      if (lettreMotivationFile) {
        stagiaire.lettre_motivation = lettreMotivationFile.path;
      }

      await stagiaire.save();
    }
    
    if (user.role === 'encadrant') {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Encadrant,
            include: [Departement]
          }
        ]
      });
      await sendEmailToUser(user.email, user.prenom, "votre mot de passe"); 
      res.status(200).json({
      success: true,
      message: "Utilisateur modifié avec succès.",
      user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role,
          prenom:user.prenom,
          Encadrant: {
            specialite: user.Encadrant.specialite,
            Departement: user.Encadrant.Departement
          }
      }
    });

    } else if (user.role === 'stagiaire') {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Stagiaire,
            
          }
        ]
      });
      await sendEmailToUser(user.email, user.prenom, "votre mot de passe"); 
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      res.status(200).json({
        success: true,
        message: "Utilisateur modifié avec succès.",
        user: {
            id: user.id,
            nom: user.nom,
            email: user.email,
            prenom:user.prenom,
            role: user.role,
            
            Stagiaire: {
                ecole: user.Stagiaire.ecole,
                filiere: user.Stagiaire.filiere,
                niveau: user.Stagiaire.niveau,
                cv: user.Stagiaire.cv ? `${baseUrl}/${user.Stagiaire.cv.replace(/\\/g, '/')}` : null,
                lettre_motivation: user.Stagiaire.lettre_motivation
                  ? `${baseUrl}/${user.Stagiaire.lettre_motivation.replace(/\\/g, '/')}` 
                  : null,
            }
            
        }  
      });
     
    }

  } catch (error) {
    console.error("Erreur lors de la modification de l'utilisateur :", error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

