'use client'
import { useRoleStore } from "./store/userStore";

export default function Home() {
  const updateRole= useRoleStore ((state) => state.updateRole);
  updateRole("Login");
  return (
    <div>

    </div>
  );
}
