import multer from 'multer';
import validateRequest from '../../middlewares/validateRequest';

import { Router } from 'express';
import { validateJWT } from '../../middlewares/validateJWT';
import {
  feedPublications,
  findAllPublicationByUser,
  findImagePublication,
  findOnePublication,
  removePublication,
  savePublication,
  uploadImage,
} from '../../controllers/publicationController';
import { body } from 'express-validator';

const router = Router();

const destinationFolder = './src/uploads/publications/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    cb(null, 'pub-' + Date.now() + '-' + file.originalname);
  },
});

const uploads = multer({ storage: storage });

router.post(
  '/save',
  [
    body('text').isString().notEmpty().isLength({ min: 1, max: 255 }),
    body('file').isString().optional(),
    validateRequest,
  ],
  validateJWT,
  savePublication,
);
router.post('/upload/:publicationId', validateRequest, [validateJWT, uploads.single('file')], uploadImage);
router.get('/feed', validateRequest, validateJWT, feedPublications);
router.get('/image/:file', validateRequest, validateJWT, findImagePublication);
router.get('/detail/:id', validateRequest, validateJWT, findOnePublication);
router.get('/user/:id', validateRequest, validateJWT, findAllPublicationByUser);
router.delete('/remove/:id', validateRequest, validateJWT, removePublication);

export default router;
