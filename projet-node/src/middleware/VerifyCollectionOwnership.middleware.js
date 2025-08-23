module.exports = (Model, relatedModel,secondModel,relationName1, relationName2) => {
  return async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;

    try {
      const userRole1 = await secondModel.findOne({where : {user_id: userId  }})
      const userRole = await relatedModel.findOne({ where: { id,[`${relationName1}_id`]: userRole1.id} });

      if (!userRole) {
        return res.status(403).json({success:false, message: "Rôle introuvable pour cet utilisateur." });
      }

      const resource = await Model.findAll({
        where: {
          [`${relationName2}_id`]: userRole.id
        }
      });

      if (!resource) {
        return res.status(403).json({success:false,  message: "Accès interdit à cette ressource." });
      }

      req.resource = resource;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({success:false,  message: "Erreur lors de la vérification de propriété." });
    }
  };
};
