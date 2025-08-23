const verifyOwnership = require('./verifyStageOwnership.middleware');
const { Stage, Encadrant, Stagiaire } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    if (userRole === 'stagiaire') {
      return verifyOwnership(Stage, Stagiaire, "stagiare")(req, res, next);
    } else if (userRole === 'encadrant') {
      return verifyOwnership(Stage, Encadrant, "encadrant")(req, res, next);
    }

    next();
  } catch (err) {
    console.error("Erreur middleware:", err);
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
