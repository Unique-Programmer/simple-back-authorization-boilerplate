import User from '../models/User';

const { secret } = require('../config');
const jwt = require('jsonwebtoken');

class productsController {
  async update(req, res, next) {
    try {
      if (req.method === 'OPTIONS') {
        next();
      }

      const token = req.headers.authorization.split(' ')[1];
      const { id = '' } = jwt.verify(token, secret);

      const products = req.body;

      if (products?.length < 4) {
        return res.status(400).json({ message: `Укажите все продукты` });
      }

      const user = await User.findById(id);

      user.products = products;

      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });

      if (!updatedUser) {
        return res.status(500).json({ message: `Ошибка сохранения продуктов` });
      }

      return res.json(updatedUser);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllByUser(req, res, next) {
    try {
      if (req.method === 'OPTIONS') {
        next();
      }

      const token = req.headers.authorization.split(' ')[1];
      const { id = '' } = jwt.verify(token, secret);

      const user = await User.findById(id);

      if (!user) {
        return res.status(500).json({ message: `Ошибка получения продуктов` });
      }

      return res.json({ products: user.products });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new productsController();
