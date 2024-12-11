import { Schema, Model } from "mongoose";
import  User  from "./User";
import ICandidate from "@/app/types/candidate";

const candidateSchema = new Schema<ICandidate>({
  experience: { type: Number, required: true },
  skills: { type: [String], required: true },
  fileUrl: { type: String, required: true },
});

const Candidate: Model<ICandidate> =
  (User.discriminators && User.discriminators.candidate) ||
  User.discriminator<ICandidate>("candidate", candidateSchema);;
export default Candidate ;
