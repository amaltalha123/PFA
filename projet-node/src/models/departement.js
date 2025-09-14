module.exports = (sequelize, DataTypes) => {
  const Departement = sequelize.define('Departement', {
    nom: DataTypes.STRING,
    etat: {
      type: DataTypes.ENUM('activé', 'archivé'),
      allowNull: false,
      defaultValue: 'activé', 
    },
  });
  
  return Departement;
};
