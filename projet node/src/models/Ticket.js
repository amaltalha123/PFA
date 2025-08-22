module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    Contenue: DataTypes.TEXT,
    commentaire_encadrant: DataTypes.TEXT,
    piece_jointe: DataTypes.STRING, 
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Ticket;
};
