import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import NotFoundError from "../errors/notFoundError";
import errorHandler from "../middlewares/errorHandler";

const router = Router();

router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.send("Service status ok");
});

router.all("*", (req: Request) => {
  throw new NotFoundError(req.path);
});

router.use(errorHandler);

export default router;
