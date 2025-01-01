// hooks/useNavigation.ts
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserContextType } from "@/app/store/UserContext";

export const useNavigation = (
  setRole: UserContextType["setRole"],
  setMail: UserContextType["setMail"]
) => {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    const cookieOptions = [
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;",
      "token=; max-age=0; path=/;",
      `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
    ];

    cookieOptions.forEach((option) => {
      document.cookie = option;
    });

    setRole(null);
    setMail(null);
    router.push("/pages/login");
  }, [setRole, setMail, router]);

  return { handleLogout, router };
};