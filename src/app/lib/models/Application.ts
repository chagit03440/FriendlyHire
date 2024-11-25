import IApplication from "@/app/types/application";
import mongoose, { Model, Schema } from "mongoose";

const applicationSchema: Schema<IApplication> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User collection
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },  // Reference to the Job collection
    fileUrl: { type: String, required: true },                          // Resume file URL
    status: { 
      type: String, 
      enum: ["Sent", "Reviewed", "Accepted", "Rejected"], // Allowed values for status
      default: "Sent", 
      required: true 
    },
  });
  
  const application: Model<IApplication> =
    mongoose.models.application || mongoose.model<IApplication>("application", applicationSchema);
  export default application;
  