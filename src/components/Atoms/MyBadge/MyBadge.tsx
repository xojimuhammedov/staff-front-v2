import { ReactNode, FC, memo } from 'react';
import { twMerge } from 'tailwind-merge';

interface MyBadgeProps {
  variant: 'orange' | 'purple' | 'red' | 'blue' | 'green' | 'neutral';
  children: ReactNode;
  className?: string;
}

/**
 * `MyBadge` is a customizable badge component that displays a colored dot alongside children content.
 * The color of the dot can be chosen from predefined variants. It is styled using Tailwind CSS.
 *
 * @component
 * @param {MyBadgeProps} props - The properties of the badge component.
 * @param {'orange' | 'purple' | 'red' | 'blue' | 'green' | 'neutral'} props.variant - The color variant of the badge dot.
 * @param {string} [props.className=''] - external className for the root element
 * @param {ReactNode} props.children - The content to be displayed next to the badge dot.
 * @returns {React.ReactElement} - The rendered badge component with a colored dot and provided content.
 */

const MyBadge: FC<MyBadgeProps> = ({ children, variant, className }) => {
  return (
    <div
      className={twMerge([
        'inline-flex flex-row items-center gap-[7px] rounded-full border border-border-base px-[6px] py-[3px]',
        className
      ])}>
      <div className="flex h-[12px] w-[12px] items-center justify-center rounded-full border border-border-base bg-bg-base">
        <div
          className={twMerge([
            'h-[6px] w-[6px] rounded-full',
            variant === 'orange' && 'bg-tag-orange-icon',
            variant === 'purple' && 'bg-tag-purple-icon',
            variant === 'red' && 'bg-tag-red-icon',
            variant === 'blue' && 'bg-tag-blue-icon',
            variant === 'green' && 'bg-tag-green-icon',
            variant === 'neutral' && 'bg-tag-neutral-icon'
          ])}
        />
      </div>
      <p className="dark:text-subtext-color-dark text-c-xs-p">{children}</p>
    </div>
  );
};

export default memo(MyBadge);
