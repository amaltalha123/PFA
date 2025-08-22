const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

// Importation des modèles
const User = require('./User')(sequelize, Sequelize);
const Departement = require('./departement')(sequelize, Sequelize);
const Encadrant = require('./encadrant')(sequelize, Sequelize);
const Notes = require('./notes')(sequelize, Sequelize);
const Stagiaire = require('./stagiaire')(sequelize, Sequelize);
const Stage = require('./stage')(sequelize, Sequelize);
const Evaluation = require('./evaluation')(sequelize, Sequelize);
const Rapport = require('./rapport')(sequelize, Sequelize);
const mission = require('./mission')(sequelize, Sequelize);
const ticket = require('./Ticket')(sequelize, Sequelize);
const evaluationRapport = require('./evaluation_rapport.js')(sequelize, Sequelize);
const document = require('./documents')(sequelize, Sequelize);


// Associations
User.hasOne(Encadrant, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Encadrant.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Stagiaire, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Stagiaire.belongsTo(User, { foreignKey: 'user_id' });

Departement.hasMany(Encadrant, { foreignKey: 'departement_id' });
Encadrant.belongsTo(Departement, { foreignKey: 'departement_id' });

Stagiaire.hasMany(Notes, { foreignKey: 'stagiaire_id',onDelete: 'CASCADE' });
Notes.belongsTo(Stagiaire, { foreignKey: 'stagiaire_id' });

Stage.hasOne(Evaluation, { foreignKey: 'stage_id' ,onDelete: 'CASCADE'});
Evaluation.belongsTo(Stage, { foreignKey: 'stage_id' });

Encadrant.hasMany(Stage, { foreignKey: 'encadrant_id' });
Stage.belongsTo(Encadrant, { foreignKey: 'encadrant_id' });

Stage.belongsTo(Stagiaire, { foreignKey: 'stagiare_id' });
Stagiaire.hasOne(Stage, { foreignKey: 'stagiare_id',onDelete: 'CASCADE' });

Stage.hasMany(mission, { foreignKey: 'stage_id',onDelete: 'CASCADE' });
mission.belongsTo(Stage, { foreignKey: 'stage_id' });

Stage.hasMany(ticket, { foreignKey: 'stage_id',onDelete: 'CASCADE' });
ticket.belongsTo(Stage, { foreignKey: 'stage_id' });

Stage.hasOne(document, { foreignKey: 'stage_id',onDelete: 'CASCADE' });
document.belongsTo(Stage, { foreignKey: 'stage_id' });

Rapport.hasOne(evaluationRapport, { foreignKey: 'rapport_id', onDelete: 'CASCADE' });
evaluationRapport.belongsTo(Rapport, { foreignKey: 'rapport_id' });

Stage.hasOne(Rapport,{ foreignKey: 'stage_id', onDelete: 'CASCADE' })
Rapport.belongsTo(Stage, { foreignKey: 'stage_id' });


// // Synchronisation de la BDD
// sequelize.sync({ alter: true })
// .then(() => console.log("Modèles synchronisés avec la base de données."))
// .catch(err => console.error(" Erreur de synchronisation :", err));

// Exporter tous les modèles
module.exports = {
  sequelize,
  Sequelize,
  User,
  Encadrant,
  Stagiaire,
  Departement,
  Stage,
  Notes,
  Evaluation,
  Rapport,
  mission,
  evaluationRapport,
  ticket,
  document,
};
