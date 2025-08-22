const { User } = require('../models');

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: "Impossible de supprimer un administrateur." });
    }

    await user.destroy();

    res.json({ message: "Utilisateur supprimé avec succès." });

  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
