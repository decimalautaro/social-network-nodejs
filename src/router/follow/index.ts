import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { validateJWT } from '../../middlewares/validateJWT';
import { followers, following, saveFollow, unFollow } from '../../controllers/followController';
import { body } from 'express-validator';

const router = Router();

router.get('/following/:id?', validateRequest, validateJWT, following);
router.get('/follower/:id?', validateRequest, validateJWT, followers);
router.post('/save', [body('followed').isString().notEmpty(), validateRequest], validateJWT, saveFollow);
router.delete('/unfollow/:id', validateRequest, validateJWT, unFollow);

export default router;
