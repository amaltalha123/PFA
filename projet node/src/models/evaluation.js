module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    ponctualite: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    autonomie:{
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    integration: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    qualite_travaille: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      }
    },
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  });

  return Evaluation;
};
