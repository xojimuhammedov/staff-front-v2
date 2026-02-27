import React from 'react';

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  // optional icon button uchun
  iconButton?: {
    icon: React.ReactNode;
    onClick: () => void;
  } | null;
}

const MyToggle: React.FC<ToggleProps> = ({ label, checked, onChange, className, iconButton }) => {
  return (
    <div className='flex flex-col gap-1'>
      <p className='text-text-base dark:text-text-title-dark'>{label}</p>
      <div
        className={`flex items-center justify-between border dark:border-dark-line rounded-lg px-3 py-2.5 ${className}`}
      >
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
              checked ? 'bg-black' : 'bg-gray-300'
            }`}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                checked ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          {label && <span className="text-gray-800 dark:text-text-title-dark">{label}</span>}
        </div>

        {iconButton && (
          <div
            onClick={iconButton.onClick}
            className="p-2 text-gray-600 bg-[#0000000D] rounded-lg cursor-pointer"
          >
            {iconButton.icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyToggle;
