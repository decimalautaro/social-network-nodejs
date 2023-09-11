import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { login, prueba, register } from '../../controllers/userController';
import { validateJWT } from '../../middlewares/validateJWT';

const router = Router();

router.get('/', validateRequest, validateJWT, prueba);
router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);

export default router;
