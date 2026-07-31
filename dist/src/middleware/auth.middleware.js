export const authMiddleware = (req, res, next) => {
    /* const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token requerido" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      // Aquí puedes validar rol "admin"
      next();
    } catch {
      return res.status(403).json({ error: "Token inválido" });
    } */
    next();
};
//# sourceMappingURL=auth.middleware.js.map