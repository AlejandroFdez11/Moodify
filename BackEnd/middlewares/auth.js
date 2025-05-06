const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado." });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; 
  } catch (error) {
    res.status(401).json({ error: "Token no válido." });
  }
};

module.exports = requireAuth;