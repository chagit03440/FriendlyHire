// components/NavBar.tsx
"use client";
import Image from "next/image";
import ButtonLink from "./Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PopupList from "./PopupList";
import { useUser } from "../store/UserContext";

const NavBar: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { role, setRole } = useUser();
  const router = useRouter();

  const adminOptions = [
    { label: "Profile", onClick: () => router.push("/pages/home/profile") },
    {
      label: "Logout",
      onClick: () => handleLogout(),
      style: "text-red-500 hover:bg-red-100",
    },
  ];

  const employeeOptions = [
    { label: "Profile", onClick: () => router.push("/pages/home/profile") },
    {
      label: "Logout",
      onClick: () => handleLogout(),
      style: "text-red-500 hover:bg-red-100",
    },
  ];

  const candidateOptions = [
    {
      label: "Profile",
      onClick: () => router.push("/pages/home/profile"),
    },
    {
      label: "Resume",
      onClick: () => router.push("/pages/home/candidate/resume"),
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
  ];

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);


  const handleLogout = () => {

    // Try multiple ways to clear the cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; max-age=0; path=/;";
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
      window.location.hostname;

    // Clear the user role in your state management
    setRole(null);

    // Redirect to login page
    router.push("/pages/login");
  };

  const renderNav = () => {
    if (!role) {
      return (
        <div className="flex items-center space-x-4">
          <ButtonLink href="/pages/login" text="Login" />
          <ButtonLink href="/pages/signup" text="Sign Up" />
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <ButtonLink href="/pages/home" text="Home" />
        <button
          onClick={togglePopup}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Image
            src="/avatar.jpg" // Replace with the path to your avatar image
            alt="User Avatar"
            width={40}
            height={40}
            className="object-cover"
          />
        </button>
      </div>

    );
  }
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#4335A7] text-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image
          src="/logo.jpg" // Path to the logo in the public folder
          alt="FriendlyHire Logo"
          width={50}  // Adjust width as per your design
          height={50} // Adjust height as per your design
          className="mr-3" // Margin right for spacing
        />
        <h1 className="text-2xl font-bold">FriendlyHire</h1>
      </div>
      {/* Conditional Rendering Section */}
      {renderNav()}

      {/* Popup Component */}
      {isPopupOpen && role === "employee" && (
        <PopupList options={employeeOptions} />
      )}
      {isPopupOpen && role === "candidate" && (
        <PopupList options={candidateOptions} />
      )}
       {isPopupOpen && role === "admin" && (
        <PopupList options={adminOptions} />
      )}
    </nav>
  );
};

export default NavBar;
