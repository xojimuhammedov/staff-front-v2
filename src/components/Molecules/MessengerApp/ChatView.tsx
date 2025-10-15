import { useRef, useEffect } from 'react';
import MessageWidget, { MessageWrapper } from './MessageWidget';
import { MessageWidgetTypeEnum } from './MessengerApp.types';

const ChatView = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div
      ref={chatContainerRef}
      className="flex-[2] overflow-scroll rounded-m border border-border-base bg-bg-subtle  p-4">
      {new Array(15).fill('').map((item, i) => (
        <MessageWrapper key={item} type={i % 3 === 0 ? 'sender' : 'receiver'}>
          <MessageWidget index={i} type={MessageWidgetTypeEnum.TEXT} />
        </MessageWrapper>
      ))}
    </div>
  );
};

export default ChatView;
