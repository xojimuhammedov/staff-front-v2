import ChatWidget from './ChatWidget';

const ChatList = () => {
  const activeStyle = [''];

  return (
    <div className="flex flex-1 flex-col gap-1">
      {new Array(5).fill('').map((item, i) => (
        <ChatWidget index={i} key={i} />
      ))}
    </div>
  );
};

export default ChatList;
