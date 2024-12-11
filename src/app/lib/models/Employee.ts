import { Schema, Model } from "mongoose";
import User from "./User";
import IEmployee from "@/app/types/employee";

const employeeSchema = new Schema<IEmployee>({
  company: { type: String, required: true },
  position: { type: String, required: true },
});

const Employee: Model<IEmployee> =
  (User.discriminators && User.discriminators.employee) ||
  User.discriminator<IEmployee>("employee", employeeSchema);
export default Employee ;

