module.exports = function (...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle '${userRole}' non autorisé.`,
      });
    }
    next();
  };
};
