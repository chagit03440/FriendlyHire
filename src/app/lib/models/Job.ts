import IJob from "@/app/types/job";
import mongoose, { Model, Schema } from "mongoose";

const jobSchema: Schema<IJob> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: Number, required: true },
    company: { type: String, required: true },
    requirements: { type: [String], required: true }, // Array of strings for skills
    location: { type: String, required: true },
    status: { type: String, enum: ["Open", "Closed"], required: true }, // Enum for status
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  });
  
  const Job: Model<IJob> =
    mongoose.models.Job || mongoose.model<IJob>("Job", jobSchema);
  export default Job;
  