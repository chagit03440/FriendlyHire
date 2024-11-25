import IUser from "@/app/types/user";
import mongoose, { Schema, Model } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["candidate", "employee"], required: true },
    profile: { type: String },
  },
  { discriminatorKey: "role", timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export { User };
export type { IUser };
