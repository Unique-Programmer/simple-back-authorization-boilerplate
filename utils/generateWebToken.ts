const jwt = require('jsonwebtoken');
const { secret } = require('../config');

export const generateWebToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };

  return jwt.sign(payload, secret, { expiresIn: '24h' });
};
