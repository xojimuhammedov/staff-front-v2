import { FC } from 'react';
import MyRadio from './MyRadio';

type MyRadioGroupType = {
  label: string;
  checked: boolean;
  // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  id: string;
};

interface MyRadioGroupProps {
  items: MyRadioGroupType[];
}

const MyRadioGroup: FC<MyRadioGroupProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <MyRadio {...item} key={i} />
      ))}
    </div>
  );
};

export default MyRadioGroup;
