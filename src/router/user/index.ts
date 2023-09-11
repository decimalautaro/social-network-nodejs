import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { login, findOneUser, register, findAll } from '../../controllers/userController';
import { validateJWT } from '../../middlewares/validateJWT';

const router = Router();

router.get('/list/:page?', validateRequest, validateJWT, findAll);
router.get('/profile/:id', validateRequest, validateJWT, findOneUser);
router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);

export default router;
