import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { login, register } from '../../controllers/userController';

const router = Router();

router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);

export default router;
