import { Schema, Model } from "mongoose";
import { User, IUser } from "./User";

interface IEmployee extends IUser {
  company: string;
  position: string;
}

const employeeSchema = new Schema<IEmployee>({
  company: { type: String, required: true },
  position: { type: String, required: true },
});

const Employee: Model<IEmployee> = User.discriminator<IEmployee>(
  "employee",
  employeeSchema
);
export { Employee }; 
export type { IEmployee };
