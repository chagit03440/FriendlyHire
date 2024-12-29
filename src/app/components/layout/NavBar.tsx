"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../../store/UserContext";
import { useMemo, useCallback, ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiFileTextFill } from 'react-icons/ri';
import { MdWork } from 'react-icons/md';

type NavOption = {
  label: string | ReactNode;
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
  const { role, setRole, setMail } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const roleOptions: RoleOptions = useMemo(
    () => ({
      admin: [
        {
          label: (
            <span className="flex items-center">
              <FaUser className="mr-2" />Profile
            </span>
          ),
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: (
            <span className="flex items-center">
              <FaSignOutAlt className="mr-2" />Logout
            </span>
          ),
          onClick: () => handleLogout(),
          style: "text-red-500 hover:bg-red-100",
        },
      ],
      employee: [
        {
          label: (
            <span className="flex items-center">
              <FaUser className="mr-2" />Profile
            </span>
          ),
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label:(
            <span className="flex items-center">
              <FaSignOutAlt className="mr-2" />Logout
            </span>
          ), 
          onClick: () => handleLogout(),
          style: "text-red-500 hover:bg-red-100",
        },
      ],
      candidate: [
        {
          label: (
            <span className="flex items-center">
              <FaUser className="mr-2" />Profile
            </span>
          ),
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: (
            <span className="flex items-center">
              <RiFileTextFill className="mr-2" />Resume
            </span>
          ),
          onClick: () => router.push("/pages/home/candidate/uploadResume"),
        },
        {
          label: (
            <span className="flex items-center">
              <MdWork className="mr-2" />My Jobs
            </span>
          ),
          onClick: () => router.push("/pages/home/candidate/myJobs"),
        },
        {
          label: (
            <span className="flex items-center">
              <FaSignOutAlt className="mr-2" />Logout
            </span>
          ),
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

    setRole(null);
    setMail(null);

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
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${option.style || "text-gray-700"
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
        src="/avatar2.png"
        alt="User Avatar"
        width={40}
        height={40}
        className="object-cover"
        priority
      />
    </button>
  );

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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