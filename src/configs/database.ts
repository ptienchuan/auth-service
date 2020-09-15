import mongoose from "mongoose";

const connectDBAsync = (): void => {
  console.log("Start connecting to database...");
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connecting database successfully");
    })
    .catch((error) => {
      console.log("Connecting database failed", error);
    });
};

export { connectDBAsync };
