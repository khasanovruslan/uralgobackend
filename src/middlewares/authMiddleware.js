// File: src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Токен не предоставлен' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Недопустимый формат токена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      roles: decoded.roles,
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
};
