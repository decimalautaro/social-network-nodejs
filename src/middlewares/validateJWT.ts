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
      throw new FailError('There is no token in the request.', 401);
    }

    const { id } = jsonwebtoken.verify(token, process.env.JWT_SECRET || '') as { id: string };
    const user = await User.findOne({ _id: id });

    const decodedJwtPayload: JwtPayloadInterface = await jwtDecode(token);

    if (!user) {
      throw new FailError('Invalid token - user does not exist DB.', 401);
    }

    if (user.deleted) {
      throw new FailError('Invalid token - user with status:true.', 401);
    }
    req.user = decodedJwtPayload;

    next();
  } catch (error) {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return res.status(401).json({ error: 'Expired token.' });
    }
    next(error);
  }
};

export { validateJWT };
