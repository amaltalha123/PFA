module.exports = (sequelize, DataTypes) => {
  const rapport_evaluation = sequelize.define('rapport_evaluation', {
    presentation_generale: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    stricture_méthodologie:{
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    contenue_rapport: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    esprit_analyse_synthèse: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    rapport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }
  });

  return  rapport_evaluation;
};
