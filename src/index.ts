import dotenv from "dotenv";
import { connectDB } from "@/configs/database";
import app from "@/app";

dotenv.config();
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
