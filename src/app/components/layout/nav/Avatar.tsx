// components/nav/Avatar.tsx
import Image from "next/image";

interface AvatarButtonProps {
  onClick: () => void;
}

export const AvatarButton: React.FC<AvatarButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border-2 border-gray-500 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors mr-6 ml-2"
  >
    <Image
      src="/imgs/avatar.png"
      alt="User Avatar"
      width={30}
      height={30}
      className="object-cover"
      priority
    />
  </button>
);
