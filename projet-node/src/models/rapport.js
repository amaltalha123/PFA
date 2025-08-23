module.exports = (sequelize, DataTypes) => {
  const Rapport = sequelize.define('Rapport', {
    contenue: DataTypes.TEXT,
    fichier: DataTypes.STRING,
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  });

  return Rapport;
};
