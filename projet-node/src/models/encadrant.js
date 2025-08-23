module.exports = (sequelize, DataTypes) => {
  const Encadrant = sequelize.define('Encadrant', {
    specialite: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    departement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Encadrant;
};
