import { Document, Types } from "mongoose";

export default interface IJob extends Document {
  _id: string;
  title: string;
  description: string;
  experience: number;
  company: string;
  requirements: string[];
  location: string;
  status: "Open" | "Closed"; // Limited to specific values
  createdBy: Types.ObjectId; // References the user who created the job
}
