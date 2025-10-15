import clsx from 'clsx';
import { FC } from 'react';
import { Info, X } from 'lucide-react';

interface AlertProps {
  variant?: 'default' | 'error' | 'warning' | 'success';
  title: string;
  description?: any;
  learnMore?: boolean;
}

const Alert: FC<AlertProps> = ({ variant = 'default', title, description = '1', learnMore }) => {
  return (
    <div
      className={clsx([
        'flex w-[440px] gap-3  rounded-m border p-3',
        variant === 'default' && 'bg-tag-neutral-bg shadow-border-base'
      ])}>
      <Info className="fill-tag-neutral-icon text-white" />
      <div className="flex-1 items-center">
        <p className="text-c-m-p text-tag-neutral-icon">Insert your alert title here!</p>
        {description && (
          <p className="mb-3 text-c-s text-tag-neutral-text">
            Insert the alert description here. It would look better as two lines of text.
          </p>
        )}
      </div>
      <X className=" text-tag-neutral-text" />
    </div>
  );
};

export default Alert;
