export default interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "candidate" | "employee";
    profile: string;
  }