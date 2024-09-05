import mongoose from "mongoose";

const connectDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Connected to MongoDB.");
    return true;
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};

export const config = {
  runtime: "nodejs",
};

export default connectDatabase;
