import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { login, findOneUser, register, findAllUser, updateUser, uploadImage } from '../../controllers/userController';
import { validateJWT } from '../../middlewares/validateJWT';

const router = Router();

router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);
router.get('/list/:page?', validateRequest, validateJWT, findAllUser);
router.get('/profile/:id', validateRequest, validateJWT, findOneUser);
router.put('/update/', validateRequest, validateJWT, updateUser);
router.post('/upload/', validateRequest, validateJWT, uploadImage);

export default router;
