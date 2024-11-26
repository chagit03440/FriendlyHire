import { Document } from "mongoose";
import { Types } from "mongoose";

export default interface IApplication extends Document {
  _id: string;
  userId: Types.ObjectId; // ID of the candidate
  jobId: Types.ObjectId; // ID of the job applied for
  fileUrl: string; // URL of the uploaded resume
  status: "Saved" | "Sent" | "Reviewed" | "Accepted" | "Rejected"; // Application status
}
