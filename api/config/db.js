import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log(`MongoDB connected successful`.bgMagenta.black);
  } catch (error) {
    console.log(error);
  }
};
