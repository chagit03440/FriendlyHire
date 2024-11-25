import IUser from "./user";

export default interface IEmployee extends IUser {
  company: string;
  position: string;
}
