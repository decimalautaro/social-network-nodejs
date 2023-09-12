import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { validateJWT } from '../../middlewares/validateJWT';
import {
  findAllPublicationByUser,
  findOnePublication,
  removePublication,
  savePublication,
} from '../../controllers/publicationController';

const router = Router();

router.post('/save', validateRequest, validateJWT, savePublication);
router.get('/detail/:id', validateRequest, validateJWT, findOnePublication);
router.get('/user/:id', validateRequest, validateJWT, findAllPublicationByUser);
router.delete('/remove/:id', validateRequest, validateJWT, removePublication);

export default router;
