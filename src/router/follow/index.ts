import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { validateJWT } from '../../middlewares/validateJWT';
import { saveFollow, unFollow } from '../../controllers/followController';

const router = Router();

router.post('/save', validateRequest, validateJWT, saveFollow);
router.delete('/unfollow/:id', validateRequest, validateJWT, unFollow);

export default router;
