import mongoose from "mongoose";

const log = (message: string, arg?: any): void => {
  if (process.env.ENVIRONMENT !== "TEST") {
    arg ? console.log(message, arg) : console.log(message);
  }
};

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    log("Start connecting to database...");
    const connection = await mongoose.connect(process.env.MONGO_URI, {
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
