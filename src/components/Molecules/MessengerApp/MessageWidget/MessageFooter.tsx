import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { CheckCheck } from 'lucide-react';

interface MessageFooterProps {
  type: 'receiver' | 'sender';
}

const MessageFooter: FC<MessageFooterProps> = ({ type }) => {
  return (
    <div className={twMerge(['flex flex-row', type === 'sender' && 'justify-end'])}>
      <span className="inline-flex items-center text-c-xs text-text-muted">
        14:24{' '}
        <CheckCheck
          width={16}
          height={16}
          className={twMerge(['ml-1', type === 'sender' && 'stroke-tag-green-icon'])}
        />
      </span>
    </div>
  );
};

export default MessageFooter;
