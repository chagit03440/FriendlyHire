// components/NavBar.tsx
'use client'
import Image from "next/image";
import ButtonLink from "./Button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import PopupList from "./PopupList";
import { getRoleFromToken } from "../services/userServices";

const NavBar: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const pathname = usePathname();

    const employeeOptions = [
        { label: 'Profile', onClick: () => console.log('Profile clicked') },
        { label: 'Add Company', onClick: () => console.log('Settings clicked') },
        { label: 'Add Position', onClick: () => console.log('Settings clicked') },
        { label: 'Logout', onClick: () => console.log('Logout clicked'), style: 'text-red-500 hover:bg-red-100' },
    ];

    const candidateOptions = [
        { label: 'Profile', onClick: () => console.log('Profile clicked') },
        { label: 'Add Expirence', onClick: () => console.log('Settings clicked') },
        { label: 'Add Skills', onClick: () => console.log('Settings clicked') },
        { label: 'Add Resume', onClick: () => console.log('Settings clicked') },
        { label: 'My Jobs', onClick: () => console.log('Settings clicked') },
        { label: 'Logout', onClick: () => console.log('Logout clicked'), style: 'text-red-500 hover:bg-red-100' },
    ];

    const getRole = async () => {
        try {
            const response = await getRoleFromToken();
            console.log(" dataaaaa", response);
            if (response?.role) {
                setRole(response.role.toLowerCase());
            }
        }
        catch (error) {
            console.error("Don't find the role:", error);
        }

    }


    const togglePopup = () => setIsPopupOpen(!isPopupOpen);
    const renderNav = () => {
        if (pathname === "/pages/home") {
            getRole();
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
    console.log("i ammmmmm", role);
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
            {isPopupOpen && (role === 'employee') && (<PopupList options={employeeOptions} /> )}
            {isPopupOpen && (role === 'candidate') && (<PopupList options={candidateOptions} /> )}
        </nav>
    );
};

export default NavBar;
