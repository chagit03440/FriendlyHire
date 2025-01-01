// components/nav/UserMenu.tsx
import { NavOption } from "./types";
import { AvatarButton } from "./Avatar";

interface UserMenuProps {
  isOpen: boolean;
  options: NavOption[];
  userName: string;
  email: string;
  onClose: () => void;
  toggleMenu: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  isOpen,
  options,
  userName,
  email,
  onClose,
  toggleMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] z-50">
      <div className="flex items-center p-4 text-black space-x-4 border-b border-gray-300 pb-2">
        <AvatarButton onClick={toggleMenu} />
        <div className="flex flex-col">
          <span className="font-bold text-lg">{userName}</span>
          <span className="text-sm text-gray-700">{email}</span>
        </div>
      </div>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            onClose();
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
