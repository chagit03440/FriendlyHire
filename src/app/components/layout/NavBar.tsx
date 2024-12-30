"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "../../store/UserContext";
import { useMemo, useCallback, ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiFileTextFill } from 'react-icons/ri';
import { IoHome } from "react-icons/io5";
import { MdWork } from 'react-icons/md';
import { getUser } from "@/app/services/userServices";

type NavOption = {
  label: string | ReactNode;
  onClick: () => void;
  style?: string;
};

type RoleOptions = {
  [key: string]: NavOption[];
};

const NavButton: React.FC<{ href: string; text: ReactNode }> = ({
  href,
  text,
}) => (
  <Link
    href={href}
    className="inline-flex items-center justify-center h-10 px-4 rounded-full border-2 border-gray-300 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white p-5"
  >
    {text}
  </Link>
);

const NavBar: React.FC = () => {
  const { role, mail, setRole, setMail } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");

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
          label: (
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
      <div className="absolute right-0 top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] z-50">
        <div className="flex items-center p-4 text-black space-x-4 border-b border-gray-300 pb-2">
          <AvatarButton onClick={toggleMenu} />
          <div className="flex flex-col">
            <span className="font-bold text-lg">{userName}</span>
            <span className="text-sm text-gray-700">{mail}</span>
          </div>
        </div>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setIsOpen(false);
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
      className="inline-flex items-center justify-center w-15 h-15 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
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

  useEffect(() => {
    // Function to fetch the creator's name
    const fetchUserName = async () => {
      try {
        if (mail) {
          const user = await getUser(String(mail));
          setUserName(user?.name || "Unknown");
          console.log("nameee", user?.name)
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
    <nav className="flex items-center justify-between bg-gray-800 text-white shadow-md relative">
      <div className="flex items-center" onClick={() => router.push("/pages/home")} >
        <div className="relative w-20 h-20 mr-3">
          <Image
            src="/logo1.png"
            alt="FriendlyHire Logo 1"
            fill
            style={{ objectFit: "contain" }}
            className="!p-0"
            priority
          />
        </div>
        <div className="relative w-20 h-20 ">
          <Image
            src="/imgs/logo2.png"
            alt="FriendlyHire Logo"
            fill
            style={{ objectFit: "contain" }}
            className="!p-0"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-orange-500">FriendlyHire</h1>
      </div>

      <div className="flex items-center gap-4">
        {role ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-white">
              <NavButton href="/pages/home" text={
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <IoHome className="text-xl mt-3" />
                  <span className="text-xs mb-2">Home</span>
                </div>
              } /> 
            </div>
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