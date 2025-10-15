import MyAvatar from 'components/Atoms/MyAvatar';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface ChatWidgetProps {
  className?: string | string[];
  index: number;
}

const ChatWidget: FC<ChatWidgetProps> = ({ className, index }) => {
  return (
    <div
      className={twMerge([
        'flex w-full flex-row  items-center gap-2 rounded-sm px-m py-xs',
        className,
        index === 0 && 'border border-border-base bg-bg-subtle [&>div:first-of-type>div]:bg-bg-base'
      ])}>
      <div>
        <MyAvatar size="large">I</MyAvatar>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-c-m-p text-text-base">Otto von Bismarck</p>
          <span className="text-c-xs text-text-muted">15:55</span>
        </div>
        <div>
          <p className="line-clamp-1 overflow-hidden overflow-ellipsis break-all">
            Sorry Bismarck, I can't tell you anything. Because I'm breathing under the control of
            Sector DLP.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
