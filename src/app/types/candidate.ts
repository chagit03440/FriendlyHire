import IUser from "./user";

export default interface ICandidate extends IUser {
  experience: number;
  skills: string[];
  fileUrl: File | null;
}
