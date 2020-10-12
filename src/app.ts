import express, { Application, json } from "express";
import routes from "@/routes";
import userRouter from "@/routes/user";
import errorHandler from "@/middlewares/error-handler";
import catchUnusedRoutes from "@/middlewares/catch-unused-routes";
import auth from "@/middlewares/auth";

const app: Application = express();

app.use(json());

app.use("/users/", userRouter);
app.use(auth, routes);

app.all("*", () => catchUnusedRoutes());
app.use(errorHandler);

export default app;
