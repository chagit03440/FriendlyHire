"use client";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../../store/UserContext";
import { useMemo, useCallback } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

type NavOption = {
  label: string;
  onClick: () => void;
  style?: string;
};

type RoleOptions = {
  [key: string]: NavOption[];
};

const NavButton: React.FC<{ href: string; text: string }> = ({
  href,
  text,
}) => (
  <Link
    href={href}
    className="inline-flex items-center justify-center h-10 px-4 rounded-full border-2 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
  >
    {text}
  </Link>
);

const NavBar: React.FC = () => {
  const { role, setRole } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const roleOptions: RoleOptions = useMemo(
    () => ({
      admin: [
        {
          label: "Profile",
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: "Logout",
          onClick: () => handleLogout(),
          style: "text-red-500 hover:bg-red-100",
        },
      ],
      employee: [
        {
          label: "Profile",
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: "Logout",
          onClick: () => handleLogout(),
          style: "text-red-500 hover:bg-red-100",
        },
      ],
      candidate: [
        {
          label: "Profile",
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: "Resume",
          onClick: () => router.push("/pages/home/candidate/uploadResume"),
        },
        {
          label: "My Jobs",
          onClick: () => router.push("/pages/home/candidate/myJobs"),
        },
        {
          label: "Logout",
          onClick: () => handleLogout(),
          style: "text-red-500 hover:bg-red-100",
        },
      ],
    }),
    [router]
  );

  const handleLogout = useCallback(() => {

    const cookieOptions = [
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;",
      "token=; max-age=0; path=/;",
      `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
    ];

    cookieOptions.forEach((option) => {
      document.cookie = option;
    });

    setIsOpen(false); // Close menu before logout
    setRole(null);
    router.push("/pages/login");
  }, [setRole, router]);

  const UserMenu: React.FC<{ isOpen: boolean; options: NavOption[] }> = ({
    isOpen,
    options,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute right-0 top-12 bg-white rounded-md shadow-lg py-2 min-w-[160px] z-50">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setIsOpen(false); // Close menu after clicking any option
              option.onClick();
            }}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
              option.style || "text-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  const AvatarButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <Image
        src="/avatar.jpg"
        alt="User Avatar"
        width={40}
        height={40}
        className="object-cover"
        priority
      />
    </button>
  );

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest(".nav-menu")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white shadow-md relative">
      <div className="flex items-center">
        <div className="relative w-12 h-12 mr-3">
          <Image
            src="/logo.png"
            alt="FriendlyHire Logo"
            fill
            style={{ objectFit: "contain" }}
            className="!p-0"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold">FriendlyHire</h1>
      </div>

      <div className="flex items-center gap-4">
        {role ? (
          <div className="flex items-center gap-4">
            <NavButton href="/pages/home" text="Home" />
            <div className="nav-menu relative">
              <AvatarButton onClick={toggleMenu} />
              <UserMenu isOpen={isOpen} options={roleOptions[role] || []} />
            </div>
          </div>
        ) : (
          <>
            <NavButton href="/pages/login" text="Login" />
            <NavButton href="/pages/signup" text="Sign Up" />
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
