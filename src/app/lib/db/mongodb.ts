import mongoose from "mongoose";
import "@/app/lib/models/Job"; // Ensure Job is registered
import "@/app/lib/models/Application";

const MONGODB_URI = process.env.MONGODB_URI || "";

let isConnected = false;
const connect = async () => {

  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connection.readyState === 1;
  } catch (error) {
    throw new Error("Error in connection to mongodb" + error);
  }
};

export default connect;
