import { FC, ComponentPropsWithoutRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface RoundedShapeProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className'> {
  children: ReactNode;
  className?: string | string[];
}

/**
 * `RoundedShape` is a component that renders a rounded div container. It's designed to be a versatile
 * container for any content, with custom styling support via Tailwind CSS. This component extends
 * the standard `div` element properties, allowing for a wide range of HTML attributes, except for
 * `className` which is handled separately to integrate with Tailwind CSS effectively.
 *
 * @component
 * @param {RoundedShapeProps} props - The properties of the rounded shape component.
 * @param {ReactNode} props.children - The content to be displayed inside the rounded shape.
 * @param {string | string[]} [props.className] - Additional custom CSS classes for styling.
 * @param {Omit<ComponentPropsWithoutRef<'div'>, 'className'>} rest - Standard `div` element properties excluding `className`.
 * @returns {React.ReactElement} - The rendered rounded shape container with content and custom styling.
 */

const RoundedShape: FC<RoundedShapeProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={twMerge([
        'flex h-8 w-8 items-center justify-center rounded-m bg-bg-base shadow-base',
        className
      ])}
      {...rest}>
      {children}
    </div>
  );
};

export default RoundedShape;
