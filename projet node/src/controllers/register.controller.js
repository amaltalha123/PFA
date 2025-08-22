const bcrypt = require('bcrypt');
const { User, Stagiaire, Encadrant, Departement } = require('../models');
const { sendWelcomeEmail } = require('../services/email.services'); 

exports.register = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    password,
    role,
    ecole,
    filiere,
    niveau,
    specialite,
    departement
  } = req.body;

  const cvFile = req.files?.cv?.[0];
  const lettreMotivationFile = req.files?.lettre_motivation?.[0];

  try {
    const existingUser  = await User.findOne({ where: { email } });
    if (existingUser ) {
      return res.status(409).json({
        success: false,
        errorCode: "EMAIL_EXISTS",
        message: 'Cet email est déjà utilisé.'
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser  = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role
    });

    

    if (role === 'stagiaire') {
      await Stagiaire.create({
        ecole,
        filiere,
        niveau,
        cv: cvFile ? cvFile.path : null,
        lettre_motivation: lettreMotivationFile ? lettreMotivationFile.path : null,
        user_id: newUser .id
      });
    } else if (role === 'encadrant') {
      const dept = await Departement.findOne({ where: { nom: departement } });
      if (!dept) {
        return res.status(400).json({
          success: false,
          errorCode: "DEPARTEMENT_NOT_FOUND",
          message: `Département "${departement}" introuvable.`
        });
      }

      await Encadrant.create({
        specialite,
        departement_id: dept.id,
        user_id: newUser .id
      });


      const emailResult = await sendWelcomeEmail(email, prenom, password); 
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          errorCode: "EMAIL_SEND_FAILED",
          message: `Erreur lors de l'envoi de l'email : ${emailResult.error}`
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Inscription réussie.',
        user: {
          id: newUser .id,
          nom: newUser .nom,
          prenom: newUser .prenom,
          email: newUser .email,
          role: newUser .role,
          Encadrant: {
            specialite: specialite,
            Departement: dept
          }
        }
      });
    }

    const emailResult = await sendWelcomeEmail(email, prenom, password); 
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          errorCode: "EMAIL_SEND_FAILED",
          message: `Erreur lors de l'envoi de l'email : ${emailResult.error}`
        });
      }
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.status(201).json({
      success: true,
      message: 'Inscription réussie.',
      user: {
        id: newUser .id,
        nom: newUser .nom,
        prenom: newUser .prenom,
        email: newUser .email,
        role: newUser .role,
        Stagiaire: {
          ecole: ecole,
          filiere: filiere,
          niveau: niveau,
          cv: cvFile ? `${baseUrl}/${cvFile.path.replace(/\\/g, '/')}` : null,
          lettre_motivation: lettreMotivationFile
            ? `${baseUrl}/${lettreMotivationFile.path.replace(/\\/g, '/')}` 
            : null,
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur serveur lors de l'inscription."
    });
  }
};
