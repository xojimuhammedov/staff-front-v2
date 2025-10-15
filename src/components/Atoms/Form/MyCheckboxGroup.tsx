import { FC, ReactNode } from 'react';
import MyCheckBox from './MyCheckbox';
import { twMerge } from 'tailwind-merge';

type MyCheckboxGroupType = {
  label: string;
  checked: boolean;
  id: string;
};

interface MyCheckboxGroupProps {
  items: MyCheckboxGroupType[];
  label?: ReactNode;
}

const MyCheckboxGroup: FC<MyCheckboxGroupProps> = ({ items, label }) => {
  return (
    <div className="flex  gap-6">
      {label && (
        <label className={twMerge(['relative mb-1.5 inline-block text-c-m-p text-text-base'])}>
          {label}
        </label>
      )}
      {items.map((item, i) => (
        <MyCheckBox {...item} key={i} />
      ))}
    </div>
  );
};

export default MyCheckboxGroup;
