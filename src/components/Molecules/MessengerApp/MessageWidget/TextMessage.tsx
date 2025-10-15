import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import MessageFooter from './MessageFooter';
import { ComponentProps } from 'react';

interface TextMessageProps extends ComponentProps<typeof MessageFooter> {}

const TextMessage: FC<TextMessageProps> = ({ type }) => {
  const generalStyles = [
    'flex flex-col bg-tag-green-bg gap-2 p-2 rounded-l-m rounded-tr-m rounded-b-l-m'
  ];

  return (
    <div className={twMerge([generalStyles, type === 'receiver' && 'bg-bg-base'])}>
      <p className="text-c-xs-p text-text-subtle">Otto von Bismarck</p>
      <p className="text-m text-text-base">How is the situation in Prussia?</p>
      <MessageFooter type={type} />
    </div>
  );
};

export default TextMessage;
