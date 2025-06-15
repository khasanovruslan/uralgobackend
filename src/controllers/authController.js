// File: src/controllers/authController.js
// File: src/controllers/authController.js
const authService = require('../services/authService');

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function setRefresh(res, rt) {
  res.cookie('refreshToken', rt, cookieOpts);
}

// Функция, которая «очищает» объект user
function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    isDriver: user.isDriver,
    roles: user.roles, 
    photoUrl:  user.photoUrl,   // добавили
    avatarUrl: user.avatarUrl,  // добавили
  };
}

module.exports = {
  async register(req, res) {
    try {
      const { user, token, refreshToken } = await authService.register(req.body);
      setRefresh(res, refreshToken);
      // Отправляем клиенту только «чистый» объект:
      return res.status(201).json({ 
        user: sanitizeUser(user), 
        token 
      });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  async login(req, res) {
    try {
      const { user, token, refreshToken } = await authService.login(req.body);
      setRefresh(res, refreshToken);
      return res.json({ 
        user: sanitizeUser(user), 
        token 
      });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  async refresh(req, res) {
    try {
      const { token, user } = await authService.refresh(req.cookies.refreshToken);
      return res.json({
        user: sanitizeUser(user),
        token,
      });
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  },

  async logout(req, res) {
    const rt = req.cookies.refreshToken;
    if (!rt) {
      return res.status(400).json({ message: 'Нет refresh-token' });
    }
    await authService.logout(rt);
    res.clearCookie('refreshToken');
    return res.json({ message: 'logout ok' });
  },
};
