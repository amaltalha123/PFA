const { Encadrant, Departement } = require('../models');

const registerEncadrant = async (user, specialite, departement) => {
  const dept = await Departement.findOne({ where: { nom: departement } });
  if (!dept) {
    throw new Error(`Département "${departement}" introuvable.`);
  }

  await Encadrant.create({
    specialite,
    departement_id: dept.id,
    user_id: user.id
  });

  return dept; 
};

module.exports = {
  registerEncadrant
};
