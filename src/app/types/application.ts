import { Document } from "mongoose";
import { Types } from "mongoose";

export default interface IApplication extends Document {
  _id: string;
  userEmail: string; // ID of the candidate
  jobId: Types.ObjectId | { _id: string; title: string; company: string }; 
  fileUrl: string; // URL of the uploaded resume
  status: "Saved" | "Sent" | "Reviewed" | "Accepted" | "Rejected"; // Application status
}
