import { create } from "zustand";

interface RoleState {
  role: string | null;
  updateRole: (newRole: string) => void;
}
const useRoleStore = create<RoleState>((set) => ({
  role: "",
  updateRole: (newRole: string) => set({ role: newRole }),
}));

interface MailUserState {
  mail: string | null;
  updateMail: (newMail: string) => void;
}
const useMailStore = create<MailUserState>((set) => ({
  mail: "",
  updateMail: (newMail: string) => set({ mail: newMail }),
}));

export {useRoleStore, useMailStore};