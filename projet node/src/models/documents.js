module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('document', {
    document_attestation: DataTypes.STRING,
    document_evaluation: DataTypes.STRING,
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }
  });

  return document;
};
