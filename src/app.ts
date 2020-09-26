import express, { Application, json } from "express";
import routes from "@/routes";

const app: Application = express();

app.use(json());
app.use(routes);

export default app;
