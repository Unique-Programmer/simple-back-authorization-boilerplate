import User from '../models/User';
import Role from '../models/Role';
import { UserRole } from '../types';
import { hashValue } from '../constants';
import { generateWebToken } from '../utils/generateWebToken';

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Ошибка при регистрации', errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }

      const hashPassword = bcrypt.hashSync(password, hashValue);
      const userRole = (await Role.findOne({ value: 'ADMIN' })) as unknown as { value: UserRole };
      const user = new User({ username, password: hashPassword, roles: [userRole], products: [] });

      await user.save();

      const token = generateWebToken(user._id, user.roles);

      return res.json({ message: 'Пользователь успешно зарегестрирован', token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Registration error', error });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `Пользователь ${username} не найден` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Введен неверный пароль' });
      }

      const token = generateWebToken(user._id, user.roles);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Login error' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Users getting error' });
    }
  }
}

export default new authController();
