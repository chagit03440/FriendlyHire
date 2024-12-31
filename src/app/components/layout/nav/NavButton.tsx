// components/nav/NavButton.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface NavButtonProps {
  href: string;
  text: ReactNode;
}

export const NavButton: React.FC<NavButtonProps> = ({ href, text }) => (
  <Link
    href={href}
    className="inline-flex items-center justify-center h-10 px-4 rounded-full border-2 border-gray-500 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors text-orange-400 p-5"
  >
    {text}
  </Link>
);
