import ChatList from './ChatList';
import ChatView from './ChatView';

const MessengerApp = () => {
  return (
    <div className="flex max-h-[600px] min-h-[600px] w-full flex-row gap-5">
      <ChatList />
      <ChatView />
    </div>
  );
};

export default MessengerApp;
