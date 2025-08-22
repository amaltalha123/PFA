module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'encadrant', 'stagiaire','user'),
      allowNull: false,
      defaultValue: 'user', 
    },
  });

  return User;
};
