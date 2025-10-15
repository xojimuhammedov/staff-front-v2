import {
  ComponentProps,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import MyButton from '../MyButton/MyButton';

interface MyDropdownProps {
  buttonProps?: ComponentProps<typeof MyButton>;
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

/**
 * `MyDropdown` is a flexible dropdown component that can toggle its visibility state based on user interaction. It utilizes a `MyButton` component for the dropdown toggle and displays its content conditionally based on the `open` state. The component supports external control of the open state via `open` and `setOpen` props, allowing for more flexible integration in various UI contexts.
 *
 * @component
 * @param {MyDropdownProps} props - The properties of the dropdown component.
 * @param {ComponentProps<typeof MyButton>} [props.buttonProps] - Optional properties to pass to the `MyButton` component used for toggling the dropdown.
 * @param {ReactNode} props.children - The content to be displayed within the dropdown menu.
 * @param {boolean} [props.open] - An optional controlled state for the visibility of the dropdown content. If provided, the component will require `setOpen` to change its state.
 * @param {Dispatch<SetStateAction<boolean>>} [props.setOpen] - An optional setter function to control the open state externally, used in conjunction with `open`.
 * @returns {React.ReactElement} - The rendered dropdown component with toggle functionality.
 */

const MyDropdown: FC<MyDropdownProps> = ({ buttonProps, children, ...rest }: any) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        rest.setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block rounded-md text-left dark:bg-text-title-dark ">
      <div>
        <MyButton
          onClick={($e: any) => {
            $e.stopPropagation();
            if (rest.setOpen) {
              rest.setOpen(!rest.open);
              return;
            }
            setOpen(!open);
          }}
          // onBlur={handleFocus}
          variant="secondary"
          type="button"
          {...buttonProps}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true">
          {buttonProps?.children}
        </MyButton>
      </div>

      {(typeof rest.open === 'boolean' ? rest.open : open) && (
        <div
          className="absolute employee-dropdown right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-bg-dark-bg"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={1}>
          <div className="py-1 " role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDropdown;
