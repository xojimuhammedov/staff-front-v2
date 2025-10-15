import { ComponentProps, FC, useState } from 'react';
import MyButton from '../MyButton';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type TabButtonProps = ComponentProps<typeof MyButton> & { value: any };

interface MyTabProps {
  queryKey: string;
  buttons: TabButtonProps[];
  initialValue: string | number;
  fullWidth?: boolean;
  className?: string;
}

/**
 * `MyTab` is a component that renders a set of tab buttons for navigation, allowing the user to switch between different views or content sections. The component's state is synchronized with the URL query parameters, enabling direct navigation to a specific tab and bookmarkable states. It uses `MyButton` components for the tab buttons, supporting customization through props.
 *
 * @component
 * @param {MyTabProps} props - The properties of the tab component.
 * @param {string} props.queryKey - The key in the URL search params that holds the active tab value.
 * @param {TabButtonProps[]} props.buttons - An array of properties for each tab button, extending `MyButton` props with a `value` used for tab selection.
 * @param {string | number} props.initialValue - The initial value of the active tab if no value is found in the URL search params.
 * @param {boolean} [props.fullWidth=false] - If true, the tab container stretches to full width, and buttons are evenly spaced.
 * @param {string} [props.className=''] - external styles for root element
 * @returns {React.ReactElement} - The rendered tab component with button navigation.
 */
const MyTab: FC<MyTabProps> = ({ queryKey, buttons, initialValue, fullWidth, className }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selected = searchParams.get(queryKey) || initialValue;

  const handleClick = (value: string) => {
    searchParams.set(queryKey, value);
    setSearchParams(searchParams);
  };

  return (
    <div
      className={twMerge(
        'flex w-fit flex-row rounded-m bg-bg-field p-1',
        fullWidth && 'w-full',
        className
      )}>
      {buttons.map((button, i) => (
        <MyButton
          className={fullWidth ? 'flex-1 md:px-[2px]' : 'md:px-[2px]'}
          variant={selected === button.value ? 'secondary' : 'ghost'}
          key={i}
          onClick={() => handleClick(button.value)}
          {...button}>
          {button.children}
        </MyButton>
      ))}
    </div>
  );
};

export default MyTab;
