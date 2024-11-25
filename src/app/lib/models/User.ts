import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employee";
  profile: Record<string, any>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["candidate", "employee"], required: true },
    profile: { type: Object, default: {} },
  },
  { discriminatorKey: "role", timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export { User };
export type { IUser };
