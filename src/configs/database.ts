import mongoose from "mongoose";

const isTestEnv = process.env.NODE_ENV === "test";

const log = (message: string, arg?: any): void => {
  if (!isTestEnv) {
    arg ? console.log(message, arg) : console.log(message);
  }
};

const connectDB = async (): Promise<typeof mongoose> => {
  const dbName = isTestEnv
    ? `${process.env.DB_NAME}-test`
    : process.env.DB_NAME;
  try {
    log("Start connecting to database...");
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    log("Connecting database successfully");

    return connection;
  } catch (error) {
    log("Connecting database failed", error);
  }
};

export { connectDB };
