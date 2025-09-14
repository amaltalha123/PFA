module.exports = (Model, SecondModel, relatedModel, relationName1, relationName2) => {
  return async (req, res, next) => {
    const id = req.params.id; // id de la mission
    const userId = req.user.id; // id de l'utilisateur connecté
    const idStage = req.params.idStage; // id du stage

    try {
      // Étape 1 : trouver l'encadrant || stagiaire lié à l'utilisateur
      const userRole1 = await SecondModel.findOne({ where: { user_id: userId } });

      //  si aucun trouvé
      if (!userRole1) {
        return res.status(403).json({ success:false, message: "Utilisateur non trouvé dans le modèle secondaire." });
      }

      // Étape 2 : vérifier que l'encadrant est bien lié au stage
      const userRole = await relatedModel.findOne({ 
        where: { 
          [`${relationName2}_id`]: userRole1.id, 
          id: idStage 
        } 
      });

      if (!userRole) {
        return res.status(403).json({ success:false, message: "Rôle introuvable pour cet utilisateur." });
      }

      // Étape 3 : vérifier la mission (ou ressource)
      const resource = await Model.findOne({
        where: {
          id,
          [`${relationName1}_id`]: idStage
        }
      });

      if (!resource) {
        return res.status(403).json({ success:false, message: "Accès interdit à cette ressource." });
      }

      req.resource = resource;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ success:false, message: "Erreur lors de la vérification de propriété." });
    }
  };
};
