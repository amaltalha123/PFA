module.exports = (sequelize, DataTypes) => {
  const Demande_Stage = sequelize.define('demande_stage', {
    nom_complet: DataTypes.STRING,
    email: DataTypes.STRING,
    cv: DataTypes.STRING,
    lettre_motivation: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('en_attente', 'validé', 'refusé'),
      allowNull: false,
      defaultValue: 'en_attente',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Demande_Stage;
};
