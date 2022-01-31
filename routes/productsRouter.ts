const Router = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();
import productsController from '../controllers/productsController';

router.post('/', authMiddleware, productsController.update);
router.get('/', authMiddleware, productsController.getAllByUser);

export default router;
