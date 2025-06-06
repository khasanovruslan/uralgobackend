const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, roles: user.roles.map(r => r.name) },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = () => {
  return require('crypto').randomBytes(64).toString('hex');
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
