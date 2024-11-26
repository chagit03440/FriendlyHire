import mongoose, { Schema, Model } from "mongoose";
import { User } from "./User";
import ICandidate from "@/app/types/candidate";

const candidateSchema = new Schema<ICandidate>({
  experience: { type: Number, required: true },
  skills: { type: [String], required: true },
  fileUrl: { type: String, required: true },
});

const Candidate: Model<ICandidate> = 
mongoose.models.Candidate ||
User.discriminator<ICandidate>(
"Employee",
candidateSchema
);
export default Candidate ;
