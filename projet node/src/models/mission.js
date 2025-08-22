module.exports = (sequelize, DataTypes) => {
  const Mission = sequelize.define('Mission', {
    description: DataTypes.TEXT,
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_limite: {
      type: DataTypes.DATE,
      allowNull: false 
    }
  });

  return Mission;
};
