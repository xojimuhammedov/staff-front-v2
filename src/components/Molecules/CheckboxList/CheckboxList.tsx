import { MyCheckbox } from 'components/Atoms/Form';
import { ChangeEvent, FC, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import MyModal from '../../Atoms/MyModal';
import AddItem from '../AddItem/AddItem';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { DEFAULT_ICON_SIZE } from '../../../constants/ui.constants';

export type CheckboxListItemType = {
  checked: boolean;
  label: string;
};

interface CheckboxListProps {
  items: CheckboxListItemType[];
  className?: string;
  addTitle?: string;
  label?: string;
  handleCheckbox?: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  onAppend?: (item: CheckboxListItemType) => void;
  onRemove?: (index: number) => void;
}

const CheckboxList: FC<CheckboxListProps> = ({
  label,
  items,
  className,
  addTitle,
  handleCheckbox,
  onAppend,
  onRemove
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <MyModal
        modalProps={{ show: open, size: 'sm' }}
        headerProps={{ children: addTitle || t('Add item') }}
        bodyProps={{ className: 'py-[1px]' }}>
        <AddItem
          onAdd={(item) => {
            if (onAppend) {
              onAppend(item);
            }
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </MyModal>
      <div className="flex flex-col gap-2">
        {label && (
          <label className={twMerge(['relative mb-1.5 inline-block text-c-m-p text-text-base'])}>
            {label}
          </label>
        )}
        <div className={twMerge(['rounded-m border border-border-base p-m', className])}>
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border-base py-4 last:border-0">
              <div className={'flex'}>
                <MyCheckbox
                  id={`${i}`}
                  checked={item.checked}
                  onChange={($e: any) => handleCheckbox && handleCheckbox($e, i)}
                />
                <label htmlFor={`${i}`} className="ml-2  text-c-m">
                  {item.label}
                </label>
              </div>
              <Trash2
                size={DEFAULT_ICON_SIZE}
                className={'cursor-pointer'}
                onClick={() => onRemove && onRemove(i)}
              />
            </div>
          ))}
        </div>
        {addTitle && (
          <div className="px-xs py-3xs">
            <p
              className="cursor-pointer text-c-s-p text-bg-brand"
              onClick={() => {
                setOpen(true);
              }}>
              {addTitle}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckboxList;
