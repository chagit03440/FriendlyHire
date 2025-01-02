// components/nav/NavBar.tsx
"use client";
import { useState, useEffect } from "react";
import { IoHome } from "react-icons/io5";
import { useUser } from "@/app/store/UserContext";
import { getUser } from "@/app/services/userServices";
import { NavButton } from "./NavButton";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { AvatarButton } from "./Avatar";
import { useNavigation } from "./useNavigation";
import { useRoleOptions } from "./useRoleOptions";

const NavBar: React.FC = () => {
  const { role, mail, setRole, setMail } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const { handleLogout, router } = useNavigation(setRole, setMail);
  const roleOptions = useRoleOptions(router, handleLogout);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (mail) {
          const user = await getUser(String(mail));
          setUserName(user?.name || "Unknown");
        }
      } catch (error) {
        console.error("Failed to fetch user's name:", error);
      }
    };
    fetchUserName();

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest(".nav-menu")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, mail]);

  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white shadow-md relative h-20">
      <Logo />
      <div className="flex items-center gap-4">
        {role ? (
          <div className="flex items-center gap-4">
            <NavButton
              href="/pages/home"
              text={
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <IoHome className="text-xl mt-3" />
                  <span className="text-xs mb-2">Home</span>
                </div>
              }
            />
            <div className="nav-menu relative">
              <AvatarButton onClick={toggleMenu} />
              <UserMenu
                isOpen={isOpen}
                options={roleOptions[role] || []}
                userName={userName}
                email={mail || ""}
                onClose={() => setIsOpen(false)}
                toggleMenu={toggleMenu}
              />
            </div>
          </div>
        ) : (
          <>
              <NavButton href="/pages/login" text="Login" />
            <div className="relative mr-5 ml-2">
              <NavButton href="/pages/signup" text="Sign Up" />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
