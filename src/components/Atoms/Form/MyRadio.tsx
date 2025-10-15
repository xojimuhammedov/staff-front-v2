import { get } from 'lodash';
import { useRef, ComponentPropsWithoutRef, FC, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface MyRadioProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  onChange?: any;
}

/**
 * `MyRadio` is a customizable checkbox component, extending standard HTML input functionality.
 * It supports an indeterminate state, a label, and additional styling using Tailwind CSS. Inherits
 * all standard input properties (like `type`, `value`, `onChange`) except for `ref`.
 *
 * @component
 * @param {MyRadioProps} props - The properties of the radio button.
 * @param {boolean} [props.indeterminate=false] - Sets the checkbox to an indeterminate state when true.
 * @param {string} [props.label] - An optional label displayed next to the checkbox.
 * @param {string} [props.className] - Additional Tailwind CSS classes for custom styling.
 * @param {...ComponentPropsWithoutRef<'input'>} [props] - Standard HTML input properties (excluding `ref`).
 * @returns {React.ReactElement} - The rendered checkbox component with optional label and custom styling.
 */

const MyRadio: FC<MyRadioProps> = ({ className, label, onChange, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(false);

  return (
    <div>
      <input
        ref={ref}
        checked={value}
        onChange={(e) => {
          onChange(), setValue(!value);
        }}
        type="radio"
        disabled
        className={twMerge([
          // DEFAULT
          'h-5 w-5 appearance-none rounded-full border-border-base transition-all  duration-100 ease-in-out',
          // HOVER
          'enabled:hover[&:not(:checked)]:bg-bg-field-hover enabled:hover:p-1',
          // FOCUS
          'enabled:focus:ring-3 enabled:focus:border-2 enabled:focus:border-bg-brand  enabled:focus:shadow-border-interactive-focus enabled:focus:ring-bg-brand/50 enabled:focus:ring-offset-2',
          // DISABLED
          'disabled:border-1 disabled:pointer-events-none disabled:border-bg-disabled',
          // CHECKED8
          'checked:text-bg-brand',
          // UNCHECKED
          '&:not(:checked):bg-bg-base'
        ])}
        // {...props}
      />
      {label && (
        <label htmlFor={get(props, 'id')} className="ml-2">
          {label}
        </label>
      )}
    </div>
  );
};

export default MyRadio;
