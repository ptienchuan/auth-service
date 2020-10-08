import express, { Application, json } from "express";
import routes from "@/routes";
import errorHandler from "@/middlewares/error-handler";
import catchUnusedRoutes from "@/middlewares/catch-unused-routes";

const app: Application = express();

app.use(json());

app.use(routes);

app.all("*", () => catchUnusedRoutes());
app.use(errorHandler);

export default app;
