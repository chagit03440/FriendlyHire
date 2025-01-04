import React from 'react'

type Option = {
  label: string;
  onClick: () => void;
  style?: string; // Optional custom styles
};

interface PopupMenuProps {
  options: Option[];
}
const PopupList: React.FC<PopupMenuProps> = ({ options }) => {
  return (
    <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <ul className="p-2 space-y-2">
        {options.map((option, index) => (
          <li key={index}>
            <button
              onClick={option.onClick}
              className={`w-full text-left px-3 py-2 rounded ${option.style || 'text-gray-700 hover:bg-gray-100'}`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PopupList
