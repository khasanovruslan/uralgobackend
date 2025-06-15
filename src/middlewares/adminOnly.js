// src/middlewares/adminOnly.js
module.exports = function (req, res, next) {
  const roles = req.user?.roles || [];
  if (!roles.includes('Admin')) {
    return res.status(403).json({ message: 'Доступ запрещён: требуются права администратора' });
  }
  next();
}
