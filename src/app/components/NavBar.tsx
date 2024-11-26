// components/NavBar.tsx
import Image from "next/image";
import ButtonLink from "./Button";

const NavBar: React.FC = () => {
    const routes = [
        { href: '/pages/login', text: 'Login' },
        { href: '/pages/signup', text: 'Sign Up' },
    
      ];

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

            {/* Buttons Section */}
            <div className="flex items-center space-x-4">
            {routes.map((route, index) => (
            <ButtonLink key={index} href={route.href} text={route.text} />
          ))}
            </div>
        </nav>
    );
};

export default NavBar;
