import { Router } from "express";
import userController from "@/controllers/user";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    return await userController.regist(req, res);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    return await userController.login(req, res);
  } catch (error) {
    return next(error);
  }
});

export default router;
