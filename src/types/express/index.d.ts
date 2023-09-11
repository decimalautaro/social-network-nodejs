declare namespace Express {
  interface Request {
    user?: JwtPayloadInterface;
  }
}
