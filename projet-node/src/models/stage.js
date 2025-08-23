module.exports = (sequelize, DataTypes) => {
  const Stage = sequelize.define('Stage', {
    stagiare_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    encadrant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_debut: DataTypes.DATE,
    date_fin : DataTypes.DATE,
    sujet: DataTypes.TEXT,
    type_stage: {
      type: DataTypes.ENUM('initiation', 'PFA', 'PFE'),
      allowNull: false,
      defaultValue: 'initiation', 
    },
  });

  return Stage;
};
