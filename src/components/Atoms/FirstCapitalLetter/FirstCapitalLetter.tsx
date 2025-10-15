import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface FirstCapitalLetterProps {
  name: string;
  className?: string;
}

/**
 * Renders a component that displays the first capital letter of a given name. It uses Tailwind CSS for styling
 * and allows additional custom classes to be applied.
 *
 * @component
 * @param {FirstCapitalLetterProps} props - The properties of the component.
 * @param {string} props.name - The name from which the first letter will be extracted and displayed.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes or custom styles to be applied.
 * @returns {React.ReactElement} - The rendered component with the first capital letter of the name.
 */

const FirstCapitalLetter: FC<FirstCapitalLetterProps> = ({ name = '', className }) => {
  return (
    <div
      className={twMerge([
        'mr-3 flex h-8 w-8 items-center justify-center rounded-xl shadow-base',
        className
      ])}>
      <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-bg-subtle">
        <span className="text-c-m-p">{name?.[0]?.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default FirstCapitalLetter;
