import { Document } from "mongoose";

export default interface IJob extends Document {
  _id: string;
  title: string;
  description: string;
  experience: number;
  company: string;
  requirements: string[];
  location: string;
  status: "Open" | "Closed";
  createdBy: string;
  matchPercentage?: number;
}
