import { passwordLength } from '../constants';

const Router = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = new Router();
import authController from '../controllers/authController';

router.post(
  '/registration',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty({ ignore_whitespace: true }),
    check('password', 'Парольне должен быть больше 4 и меньше 8 символов').isLength({ min: 4, max: 8 }),
  ],
  authController.registration,
);
router.post(
  '/login',
  [
    [
      check('username', 'Имя пользователя не может быть пустым').notEmpty({ ignore_whitespace: true }),
      check('password', 'Парольне должен быть больше 4 и меньше 8 символов').isLength(passwordLength),
    ],
  ],
  authController.login,
);
router.get('/users', authMiddleware, roleMiddleware(['ADMIN']), authController.getUsers);

export default router;
