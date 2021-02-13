import { Router } from "express";
import userRouter from "@/routes/user";

const privateRouter = Router();

privateRouter.use("/users", userRouter.private);

const publicRouter = Router();

publicRouter.use("/users", userRouter.public);

export default { private: privateRouter, public: publicRouter };
