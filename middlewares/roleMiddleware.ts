module.exports = function (roles) {
  return function (req, res, next) {
    const jwt = require('jsonwebtoken');
    const { secret } = require('../config');
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'Пользователь не авторизован' });
      }

      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;

      console.log('-----userRoles', userRoles);

      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return res.status(403).json({ message: 'У вас нет досутпа' });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
  };
};
