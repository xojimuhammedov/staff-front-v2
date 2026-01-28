import { Component, ReactElement, ReactNode, forwardRef } from 'react';
import storage from 'services/storage';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';

type Elevated = boolean;
type Size = 'base' | 'large' | 'xlarge';
type Rounded = boolean;

type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    as?: C extends string ? 'button' | 'a' : C;
    variant?: Variant;
    elevated?: Elevated;
    size?: Size;
    rounded?: Rounded;
    className?: string[] | string;
    allowedRoles?: string[]; 
  }
> & { startIcon?: any; endIcon?: any; disabled?: boolean };

type ButtonComponent = <C extends React.ElementType = 'button'>(
  props: ButtonProps<C>
) => React.ReactElement | null;

/**
 * `MyButton` is a customizable button component for React applications, styled using Tailwind CSS. It supports various sizes, variants, and additional styling options.
 *
 * @template C - The component type (e.g., 'button', 'a').
 * @param {Object} props - The properties of the button.
 * @param {ElementType} [props.as] - The element type to render, defaults to 'button'.
 * @param {string} [props.variant] - Style variant ('primary', 'secondary', 'destructive', 'ghost').
 * @param {boolean} [props.elevated] - If true, applies elevation effect.
 * @param {string} [props.size] - Size of the button ('base', 'large', 'xlarge').
 * @param {boolean} [props.rounded] - If true, applies rounded corners.
 * @param {string | string[]} [props.className] - Additional CSS class names.
 * @param {ReactNode} [props.startIcon] - Icon displayed at the start.
 * @param {ReactNode} [props.endIcon] - Icon displayed at the end.
 * @param {boolean} [props.disabled] - If true, disables the button.
 * @param {ReactNode} children - Children nodes inside the button.
 * @param {PolymorphicRef<C>} [ref] - Ref forwarded to the component.
 * @returns {ReactElement | null} - The rendered button component.
 */

// @ts-ignore
const MyButton: ButtonComponent = forwardRef(
  <C extends React.ElementType>(
    {
      as,
      size = 'large',
      variant,
      elevated,
      rounded,
      children,
      startIcon,
      endIcon,
      disabled,
      className,
      allowedRoles,
      ...props
    }: ButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const userData: any = storage.get("userData")
    const userRole = JSON.parse(userData)?.role

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return null;
    }

    const Component = as || 'button';

    const base = ['h-8', !children && 'w-8'];
    const large = ['h-10', !children && 'w-10'];
    const xlarge = ['h-12', !children && 'w-12'];

    const generalStyles = [
      'dark:bg-text-title-dark flex items-center justify-center px-[8px] py-[6px] rounded-lg text-c-m-p [&_svg]:w-5 [&_svg]:h-5  dark:text-black dark:font-medium dark:hover:bg-dark-form'
    ];

    // TODO static shadow value
    const primary = [
      // 'text-white [& svg:first-of-type]:w-5  [&>svg]:h-5 shadow-button-primary primary-button focus:shadow-border-interactive-active'
      'text-white [& svg:first-of-type]:w-5 [&>svg]:h-5 shadow-button-primary primary-button focus:shadow-border-interactive-active'
    ];

    const disabledStyle = [
      'disabled:pointer-events-none bg-bg-field-hover shadow-border-base text-text-disabled'
    ];

    const secondary = [
      'secondary shadow-border-base text-text-base focus:shadow-border-interactive-active'
    ];

    const destructive = [
      'destructive text-white shadow-button-destructive focus:shadow-border-interactive-active'
    ];

    const ghost = ['ghost', 'text-white text-text-base focus:shadow-border-interactive-active'];

    const ghostDisabled = ['disabled:text-text-disabled disabled:bg-white shadow-none'];

    return (
      <Component
        {...props}
        ref={ref}
        disabled={disabled}
        className={twMerge([
          generalStyles,
          variant === 'primary' && primary,
          disabled && disabledStyle,
          variant === 'secondary' && secondary,
          variant === 'destructive' && destructive,
          variant === 'ghost' && ghost,
          size === 'base' && base,
          size === 'large' && large,
          size === 'xlarge' && xlarge,
          className && className,
          variant === 'ghost' && disabled && ghostDisabled
        ])}>
        {startIcon && <span className={children ? 'mr-2' : ''}>{startIcon}</span>}
        {children && children}
        {endIcon && <span className={children ? 'ml-2' : ''}>{endIcon}</span>}
      </Component>
    );
  }
);

export default MyButton;
