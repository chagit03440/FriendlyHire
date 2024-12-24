import IApplication from "@/app/types/application";
import { ApplicationStatus } from "@/app/types/enums";
import mongoose, { Model, Schema } from "mongoose";

const applicationSchema: Schema<IApplication> = new Schema({
    userEmail: { type: String }, // Reference to the User collection
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },  // Reference to the Job collection
    fileUrl: { type: String, required: true },                          // Resume file URL
    status: { 
      type: String, 
      enum: ApplicationStatus, // Allowed values for status
      default: ApplicationStatus.Saved, 
      required: true 
    },
  });
  
  const Application: Model<IApplication> =
    mongoose.models.application || mongoose.model<IApplication>("application", applicationSchema);
  export default Application;
  