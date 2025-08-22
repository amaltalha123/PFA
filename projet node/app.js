const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./src/models/index.js'); 
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// Import des routes
const authRoutes = require('./src/routes/auth.routes.js');
app.use('/api/auth', authRoutes);

const registerRoute = require('./src/routes/register.routes.js');
app.use('/api/auth', registerRoute);

const profileRoutes = require('./src/routes/profile.routes.js');
app.use('/api/auth', profileRoutes);

const profileUpdateRoutes  = require('./src/routes/updateprofile.routes.js');
app.use('/api/auth', profileUpdateRoutes);


const deleteUserRoutes  = require('./src/routes/deleteUser.routes.js');
app.use('/api/auth', deleteUserRoutes);

const stagiaireRoutes = require('./src/routes/stagiaire.routes.js');
app.use('/api/auth', stagiaireRoutes);

const encadrantRoutes = require('./src/routes/encadrant.routes.js');
app.use('/api/auth', encadrantRoutes);

const departementRoutes = require('./src/routes/departement.routes.js');
app.use('/api/auth',departementRoutes);

const notesRoutes = require('./src/routes/notes.routes.js');
app.use('/api/auth',notesRoutes);

const missionRoutes = require('./src/routes/mission.routes.js');
app.use('/api/auth',missionRoutes);

app.use('/uploads', express.static('uploads'));

const ticketRoutes = require('./src/routes/ticket.routes.js');
app.use('/api/auth',ticketRoutes);

const rapportRoutes = require('./src/routes/rapport.routes.js');
app.use('/api/auth',rapportRoutes);

const evaluationRapportRoutes = require('./src/routes/evaluationRapport.routes.js');
app.use('/api/auth',evaluationRapportRoutes);

const stageRoutes = require('./src/routes/stage.routes.js');
app.use('/api/auth',stageRoutes);

const evaluationRoutes = require('./src/routes/evaluationStagiaire.routes.js');
app.use('/api/auth',evaluationRoutes);

const evaluationDocRoutes = require('./src/routes/documents.routes.js');
app.use('/api/auth',evaluationDocRoutes);

const statistiquesRoutes = require('./src/routes/statistiques.routes.js');
app.use('/api/auth',statistiquesRoutes);

module.exports = app;


