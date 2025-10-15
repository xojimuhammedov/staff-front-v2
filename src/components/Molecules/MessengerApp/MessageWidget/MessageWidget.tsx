import { FC, ReactNode } from 'react';
import { MessageWidgetTypeEnum } from '../MessengerApp.types';
import TextMessage from './TextMessage';
import { twMerge } from 'tailwind-merge';

interface MessageWidgetProps {
  type?: MessageWidgetTypeEnum;
  index: number;
}

interface MessageWrapperProps {
  type: 'receiver' | 'sender';
  children: ReactNode;
}

export const MessageWrapper: FC<MessageWrapperProps> = ({ type, children }) => (
  <div className={twMerge(['mb-4 w-[fit-content]', type === 'sender' && 'ml-auto'])}>
    {children}
  </div>
);

const MessageWidget: FC<MessageWidgetProps> = ({ type, index }) => {
  switch (type) {
    case MessageWidgetTypeEnum.TEXT:
      return <TextMessage type={index % 3 === 0 ? 'sender' : 'receiver'} />;
    default:
      return null;
  }
};

export default MessageWidget;
