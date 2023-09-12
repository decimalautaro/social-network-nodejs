import { Router } from 'express';
import multer from 'multer';
import validateRequest from '../../middlewares/validateRequest';
import {
  login,
  findOneUser,
  register,
  findAllUser,
  updateUser,
  uploadImage,
  avatar,
  counters,
} from '../../controllers/userController';
import { validateJWT } from '../../middlewares/validateJWT';
import { body } from 'express-validator';

const router = Router();

const destinationFolder = './src/uploads/avatars/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + '-' + file.originalname);
  },
});

const uploads = multer({ storage: storage });

router.post(
  '/register',
  [
    body('name').notEmpty().isString(),
    body('lastname').optional().isString(),
    body('nickName').isString().notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty().isStrongPassword({
      minLength: 3,
    }),
    body('role').isString().optional(),
    body('image').isString().optional().isString(),
    validateRequest,
  ],
  register,
);
router.post('/login', [body('email').isEmail(), body('password').notEmpty().isString(), validateRequest], login);
router.get('/list/:page?', validateRequest, validateJWT, findAllUser);
router.get('/profile/:id', validateRequest, validateJWT, findOneUser);
router.put(
  '/update/',
  [
    body('name').isString(),
    body('lastname').isString(),
    body('nickName').isString(),
    body('email').isEmail(),
    body('password').isString().optional(),
    body('role').isString().optional(),
    body('image').optional().isString(),
    validateRequest,
  ],
  validateJWT,
  updateUser,
);
router.post('/upload/', validateRequest, validateJWT, uploads.single('file'), uploadImage);
router.get('/avatar/:file', validateRequest, validateJWT, avatar);
router.get('/counters/:id', validateRequest, validateJWT, counters);

export default router;
