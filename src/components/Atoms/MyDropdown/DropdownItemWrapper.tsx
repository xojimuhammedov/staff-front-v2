import { ComponentPropsWithoutRef, ReactNode, FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface DropdownItemWrapperProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className'> {
  children: ReactNode;
  className?: string | string[];
}
const DropdownItemWrapper: FC<DropdownItemWrapperProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={twMerge([
        'cursor-pointer bg-bg-base px-3 py-2 hover:bg-bg-field-hover dark:bg-bg-dark-bg dark:hover:bg-bg-darkBg',
        className
      ])}
      {...rest}>
      {children}
    </div>
  );
};

export default DropdownItemWrapper;
