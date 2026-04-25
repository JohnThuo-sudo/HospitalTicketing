const ensureRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!Array.isArray(roles) || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient privileges" });
    }

    next();
  };
};

module.exports = ensureRole;
