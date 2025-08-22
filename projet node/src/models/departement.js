module.exports = (sequelize, DataTypes) => {
  const Departement = sequelize.define('Departement', {
    nom: DataTypes.STRING,
  });

  return Departement;
};
