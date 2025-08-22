module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define('Notes', {
    contenue: DataTypes.TEXT,
    date: {
      type: DataTypes.DATEONLY, 
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#3B82F6'
    },
    
    stagiaire_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Notes;
};
