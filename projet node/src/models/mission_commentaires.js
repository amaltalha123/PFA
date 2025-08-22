module.exports = (sequelize, DataTypes) => {
  const Mission_comentaires = sequelize.define(' Mission_comentaires', {
    commentaire: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return  Mission_comentaires;
};
