import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import FailError from '../errors/FailError';
import { User } from '../models/User';

export interface JwtPayloadInterface {
  id: string;
}

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('auth-token');

    if (!token) {
      throw new FailError('No hay token en la petición', 401);
    }

    const { id } = jsonwebtoken.verify(token, process.env.JWT_SECRET || '') as { id: string };
    const user = await User.findOne({ _id: id });

    const decodedJwtPayload: JwtPayloadInterface = await jwtDecode(token);

    if (!user) {
      throw new FailError('Token no válido - usuario no existe DB', 401);
    }

    if (user.deleted) {
      throw new FailError('Token no válido - usuario con estado:true', 401);
    }
    req.user = decodedJwtPayload;

    next();
  } catch (error) {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expirado' });
    }
    next(error);
  }
};

export { validateJWT };
