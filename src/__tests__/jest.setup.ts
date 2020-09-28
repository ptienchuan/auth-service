import mongoose from "mongoose";
import { connectDB } from "@/configs/database";

beforeAll(async () => {
  await connectDB();
  await mongoose.connection.db.dropDatabase();
});
