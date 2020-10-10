import { Router, Request, Response, NextFunction } from "express";
import userController from "@/controllers/user";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    return await userController.regist(req, res);
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await userController.login(req, res);
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
