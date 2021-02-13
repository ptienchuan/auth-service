import { Router } from "express";
import userController from "@/controllers/user";

const publicRouter = Router();

publicRouter.post("/", async (req, res, next) => {
  try {
    await userController.regist(req, res);
  } catch (error) {
    next(error);
  }
});

publicRouter.post("/login", async (req, res, next) => {
  try {
    await userController.login(req, res);
  } catch (error) {
    next(error);
  }
});

const privateRouter = Router();

privateRouter.post("/logout", async (req, res, next) => {
  try {
    await userController.logout(req, res);
  } catch (error) {
    next(error);
  }
});

privateRouter.post("/logout-all", async (req, res, next) => {
  try {
    await userController.logoutAll(req, res);
  } catch (error) {
    next(error);
  }
});

export default { public: publicRouter, private: privateRouter };
