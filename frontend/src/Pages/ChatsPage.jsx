import React from "react";
import { useChat } from "../Context/ChatProvider";
import ChatList from "../Components/chat/ChatList";
import ChatRoom from "../Components/chat/ChatRoom";
import { useMediaQuery } from "@mantine/hooks";

const ResponsiveChatView = () => {
  const isLargeScreen = useMediaQuery("(min-width: 768px)"); // Tailwind's `md` breakpoint
  const { activeChatId } = useChat();

  if (isLargeScreen) {
    return (
      <div className="flex w-full gap-4 px-2 md:px-6 lg:px-12 xl:px-24 mt-4">
        {/* Left: Chat List */}
        <div className="w-2/5 border-r-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 h-[calc(100vh-4rem)] overflow-y-auto rounded-xl shadow">
          <ChatList />
        </div>

        {/* Right: Chat Room */}
        <div className="w-3/5 lg:w-4/5 bg-white dark:bg-zinc-900 rounded-xl shadow h-[calc(100vh-4rem)] overflow-y-auto">
          <ChatRoom />
        </div>
      </div>
    );
  }

  // On small screens, toggle based on activeChatId
  return (
    <div className="w-full h-[calc(100vh-4rem)] overflow-y-auto px-4 mt-4">
      {activeChatId ? <ChatRoom /> : <ChatList />}
    </div>
  );
};

const ChatsPage = () => {
  return <ResponsiveChatView />;
};

export default ChatsPage;
