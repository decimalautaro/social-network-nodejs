import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { validateJWT } from '../../middlewares/validateJWT';
import { followed, following, saveFollow, unFollow } from '../../controllers/followController';

const router = Router();

router.get('/following/:id?', validateRequest, validateJWT, following);
router.get('/followed/:id?', validateRequest, validateJWT, followed);
router.post('/save', validateRequest, validateJWT, saveFollow);
router.delete('/unfollow/:id', validateRequest, validateJWT, unFollow);

export default router;
