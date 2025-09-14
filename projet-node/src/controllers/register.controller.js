const bcrypt = require('bcrypt');
const Joi = require('joi');
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

const UserSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required()
});

const StagiaireSchema = UserSchema.concat(Joi.object({
  ecole: Joi.string().required(),
  filiere: Joi.string().required(),
  niveau: Joi.string().required(),
}));


const EncadrantSchema = UserSchema.concat(Joi.object({
  specialite: Joi.string().required(),
  departement: Joi.string().required(),
}));

const CheckExistingUser= async (email,res) =>{
   const existingUser  = await User.findOne({ where: { email } });
    if (existingUser ) {
      return res.status(409).json({
        success: false,
        errorCode: "EMAIL_EXISTS",
        message: 'Cet email est déjà utilisé.'
      });
    }
}

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
exports.addStagiaire = async (req, res) => {
  try {
    const data = {
      ...req.body
    };

    if(req.body.role!='stagiaire'){
      return res.status(400).json({success:false, message: "le role de l'utilisateur doit etre stagiaire" });
    }

    // Validation
    const cvFile = req.files?.cv?.[0];
    const lettreMotivationFile = req.files?.lettre_motivation?.[0];
    if (!cvFile || !lettreMotivationFile) {
      return res.status(400).json({
        success: false,
        message: "Les fichiers CV et lettre de motivation sont obligatoires."
      });
    }
    const { error, value } = StagiaireSchema.validate(data);

    if (error) {
      return res.status(400).json({ success:false, message: error.details[0].message });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const email=req.body.email;
    await CheckExistingUser(email);

    // Création User + Stagiaire
    const stagiaire = await User.create(
      {
        nom: value.nom,
        prenom: value.prenom,
        email: value.email,
        password: hashedPassword,
        role: "stagiaire",
        Stagiaire: {
          ecole: value.ecole,
          filiere: value.filiere,
          niveau: value.niveau,
          cv: cvFile ? cvFile.path : null,
          lettre_motivation: lettreMotivationFile ? lettreMotivationFile.path : null,
        }
      },
      { include: [Stagiaire] } 
    );
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    await sendEmailToUser(email, req.body.prenom, req.body.password); 
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie.',
      user: {
        id: stagiaire.id,
        nom: stagiaire.nom,
        prenom: stagiaire.prenom,
        email: stagiaire.email,
        role: stagiaire.role,
        Stagiaire: {
          ecole: value.ecole,
          filiere: value.filiere,
          niveau: value.niveau,
          cv: cvFile ? `${baseUrl}/${cvFile.path.replace(/\\/g, '/')}` : null,
          lettre_motivation: lettreMotivationFile
            ? `${baseUrl}/${lettreMotivationFile.path.replace(/\\/g, '/')}` 
            : null,
        }
      }
    });

  } catch (err) {
    return res.status(500).json({success:false, message: "Erreur serveur", error: err.message });
  }
}

exports.addEncadrant = async (req, res) => {
  const data={...req.body};

  try{
  if(req.body.role != 'encadrant'){
    return res.status(400).json({ success:false, message: "le role de l'utilisateur doit etre encadrant"});
  }
  // Validation
    const { error, value } = EncadrantSchema.validate(data);

    if (error) {
      return res.status(400).json({ success:false,message: error.details[0].message });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const email=req.body.email;
    await CheckExistingUser(email,res);


    const dept = await Departement.findOne({ where: { nom: req.body.departement } });
      if (!dept) {
        return res.status(400).json({
          success: false,
          errorCode: "DEPARTEMENT_NOT_FOUND",
          message: `Département "${req.body.departement}" introuvable.`
        });
      }
    // Création User + Encadrant
    const encadrant = await User.create(
      {
        nom: value.nom,
        prenom: value.prenom,
        email: value.email,
        password: hashedPassword,
        role: "encadrant",
        Encadrant: {
          specialite: value.specialite,
          departement_id: dept.id,
        }
      },
      { include: [Encadrant] } 
    );

     await sendEmailToUser(email, req.body.prenom, req.body.password); 
    
     return res.status(201).json({
        success: true,
        message: 'Inscription réussie.',
        user: {
          id: encadrant.id,
          nom: encadrant.nom,
          prenom: encadrant.prenom,
          email: encadrant.email,
          role: encadrant.role,
          Encadrant: {
            specialite: encadrant.Encadrant.specialite,
            Departement: dept
          }
        }
     });
  } catch (err) {
    return res.status(500).json({success:false, message: "Erreur serveur", error: err.message });
  }
}
