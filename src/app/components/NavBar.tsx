// components/NavBar.tsx
'use client'
import Image from "next/image";
import ButtonLink from "./Button";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavBar: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const pathname = usePathname();

    const togglePopup = () => setIsPopupOpen(!isPopupOpen);

    const renderNav = () => {
        if (pathname === "/pages/home") {
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
        } else {
            return (
                <div className="flex items-center space-x-4">
                    <ButtonLink href="/pages/login" text="Login" />
                    <ButtonLink href="/pages/signup" text="Sign Up" />
                </div>
            );
        }
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
            {isPopupOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="p-2 space-y-2">
                        <li>
                            <button className="w-full text-left text-gray-700 hover:bg-gray-100 px-3 py-2 rounded">
                                Profile
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left text-gray-700 hover:bg-gray-100 px-3 py-2 rounded">
                                Settings
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left text-red-500 hover:bg-red-100 px-3 py-2 rounded">
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}

        </nav>
    );
};

export default NavBar;
