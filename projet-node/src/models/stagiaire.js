module.exports = (sequelize, DataTypes) => {
  const Stagiaire = sequelize.define('Stagiaire', {
    ecole: DataTypes.STRING,
    filiere: DataTypes.STRING,
    niveau: DataTypes.STRING,
    cv: DataTypes.STRING,
    lettre_motivation: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    
  });

  return Stagiaire;
};
