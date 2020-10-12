import { Router } from "express";
import userRouter from "@/routes/user";

const router = Router();

router.use("/users", userRouter.private);

export default router;
