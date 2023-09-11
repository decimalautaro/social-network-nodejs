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
} from '../../controllers/userController';
import { validateJWT } from '../../middlewares/validateJWT';

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

router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);
router.get('/list/:page?', validateRequest, validateJWT, findAllUser);
router.get('/profile/:id', validateRequest, validateJWT, findOneUser);
router.put('/update/', validateRequest, validateJWT, updateUser);
router.post('/upload/', validateRequest, [validateJWT, uploads.single('file')], uploadImage);
router.get('/avatar/:file', validateRequest, validateJWT, avatar);

export default router;
