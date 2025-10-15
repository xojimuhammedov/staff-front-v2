import { twMerge } from 'tailwind-merge';
import { ChangeEvent, FC } from 'react';

interface MySwitchProps {
  disabled?: boolean;
  checked?: boolean;
  size?: 'base' | 'small';
  label?: string;
  rootClassName?: string;
  labelClassName?: string;
  onChange: ($e: ChangeEvent<HTMLInputElement>) => void;
}

type FormInputRef = React.ComponentPropsWithRef<'input'>['ref'];

const MySwitch: FC<MySwitchProps> = ({
  disabled,
  checked,
  size = 'base',
  label,
  rootClassName,
  labelClassName,
  ...restProps
}) => {
  const baseStyles = ['h-[18px] w-8 after:h-[16px] after:w-[16px]'];
  const smallStyles = ['h-4 w-7 after:h-3 after:w-3'];

  return (
    <label
      className={twMerge([
        'relative inline-flex w-[fit-content] cursor-pointer items-center',
        rootClassName
      ])}>
      <input
        {...restProps}
        type="checkbox"
        value=""
        disabled={disabled}
        checked={checked}
        className="peer sr-only"
      />
      <div
        className={twMerge([
          `
        peer rounded-full bg-bg-switch shadow-base after:absolute after:start-[2px] after:top-[2px] after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-bg-brand peer-checked:after:start-[-2px] peer-checked:after:translate-x-full  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bg-brand/40 
        peer-disabled:bg-bg-disabled peer-disabled:outline-none peer-disabled:after:bg-text-disabled
        rtl:peer-checked:after:-translate-x-full
        `,
          size === 'base' && baseStyles,
          size === 'small' && smallStyles
        ])}
      />
      {label && (
        <span className={twMerge(['ml-2 text-c-m-p text-text-base', labelClassName])}>{label}</span>
      )}
    </label>
  );
};

export default MySwitch;
