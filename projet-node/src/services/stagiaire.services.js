const { Stagiaire } = require('../models');

const registerStagiaire = async (newUser , ecole, filiere, niveau, cvFile, lettreMotivationFile) => {
  await Stagiaire.create({
    ecole,
    filiere,
    niveau,
    cv: cvFile ? cvFile.path : null,
    lettre_motivation: lettreMotivationFile ? lettreMotivationFile.path : null,
    user_id: newUser .id // Utilisez newUser  au lieu de user
  });

  return {
    success: true,
    message: 'Inscription réussie.',
    user: {
      id: newUser .id,
      nom: newUser .nom,
      prenom: newUser .prenom,
      email: newUser .email,
      role: newUser .role,
      Stagiaire: {
        ecole,
        filiere,
        niveau,
        cv: cvFile ? cvFile.path : null,
        lettre_motivation: lettreMotivationFile ? lettreMotivationFile.path : null,
        user_id: newUser .id // Utilisez newUser  au lieu de user
      }
    }
  };
};

module.exports = {
  registerStagiaire
};
