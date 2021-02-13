import express, { Application, json } from "express";
import routes from "@/routes";
import errorHandler from "@/middlewares/error-handler";
import catchUnusedRoutes from "@/middlewares/catch-unused-routes";
import auth from "@/middlewares/auth";

const app: Application = express();

app.use(json());

// authentication not required
app.use(routes.public);

// authentication required
app.use(auth, routes.private);

app.all("*", () => catchUnusedRoutes());
app.use(errorHandler);

export default app;
