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
    <nav className="flex flex-wrap items-center justify-between bg-gray-800 text-white shadow-md px-4 py-2 md:h-20">
      <Logo />
      <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
        {role ? (
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {/* Home Button */}
            <NavButton
              href="/pages/home"
              text={
                <div className="flex flex-col items-center justify-center text-center px-1 md:px-2">
                  <IoHome className="text-lg md:text-xl mt-1 md:mt-2" />
                  <span className="text-xs md:text-sm">Home</span>
                </div>
              }
            />

            {/* Avatar and User Menu */}
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
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {/* Login Button */}
            <NavButton
              href="/pages/login"
              text="Log in"
            />

            {/* Sign-Up Button */}
            <NavButton
              href="/pages/signup"
              text="Sign up"
            />
          </div>
        )}
      </div>
    </nav>
  );

};

export default NavBar;
