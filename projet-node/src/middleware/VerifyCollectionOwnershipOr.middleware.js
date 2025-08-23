const verifyOwnership = require('./VerifyCollectionOwnership.middleware');
const { Stage, Encadrant, Stagiaire } = require('../models');

module.exports = ( relatedModel) =>{ 
    return async (req, res, next) => {
    try {
        const userRole = req.user.role;

        if (userRole === 'stagiaire') {
        return verifyOwnership(relatedModel, Stage,Stagiaire, "stagiare","stage")(req, res, next);
        } else if (userRole === 'encadrant') {
        return verifyOwnership(relatedModel, Stage,Encadrant,"encadrant","stage")(req, res, next);
        }

        return res.status(403).json({success:false,  message: "Accès interdit" });
    } catch (err) {
        console.error("Erreur middleware:", err);
        return res.status(500).json({ success:false, message: "Erreur serveur", error: err.message });
    }
    };
}