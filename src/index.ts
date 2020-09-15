import dotenv from "dotenv";
import { connectDBAsync } from "./configs/database";
import app from "./app";

dotenv.config();
connectDBAsync();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
