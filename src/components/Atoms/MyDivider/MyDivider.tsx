import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface MyDividerProps {
  className?: string;
}

/**
 * `MyDivider` is a simple component that renders a horizontal divider line. It is styled using Tailwind CSS to have a specific height, full width, and background color.
 *
 * @component
 * @param {Object} props - The properties of the select component.
 * @param {string} [props.className] - external styles for the divider
 * @returns {React.ReactElement} - The rendered divider element.
 */

const MyDivider: FC<MyDividerProps> = ({ className }) => {
  return <div className={twMerge(['my-l h-[1px] w-full bg-border-base dark:bg-dark-line', className])} />;
};

export default MyDivider;
