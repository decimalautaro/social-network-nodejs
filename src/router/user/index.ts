import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { register } from '../../controllers/userController';

const router = Router();

router.post('/', validateRequest, register);

export default router;
