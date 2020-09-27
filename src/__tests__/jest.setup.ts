import mongoose from "mongoose";
import { connectDB } from "@/configs/database";

describe("Jest setup: ", () => {
  beforeAll(async () => {
    await connectDB();
    await mongoose.connection.db.dropDatabase();
  });

  test("Jest setup was fired", () => expect(true).toBe(true));
});
