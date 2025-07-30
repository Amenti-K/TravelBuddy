import { SimpleGrid, Text, Center } from "@mantine/core";
import ChatCard from "./ChatCard";
import { ChatCardSkeleton } from "../common/Skeletons";
import { useChat } from "../../Context/ChatProvider";

export default function ChatList() {
  const { chatList, chatListLoading, chatListError, activeChatId } = useChat();

  if (chatListLoading) {
    return (
      <SimpleGrid cols={1} spacing="xs" className="pb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="mb-0">
            <ChatCardSkeleton />
          </div>
        ))}
      </SimpleGrid>
    );
  }

  if (chatListError) {
    return (
      <Center className="py-8">
        <Text
          size="sm"
          className="text-red-600 dark:text-red-400"
        >
          Failed to load chats: {chatListError}
        </Text>
      </Center>
    );
  }

  if (!chatList?.length) {
    return (
      <Center className="py-8">
        <Text
          size="lg"
          className="text-gray-500 dark:text-gray-300"
        >
          No chats found.
        </Text>
      </Center>
    );
  }

  return (
    <SimpleGrid cols={1} spacing="xs" className="pb-4">
      {chatList.map((chat) => (
        <ChatCard
          key={chat._id}
          chat={chat}
          isActive={chat._id === activeChatId}
        />
      ))}
    </SimpleGrid>
  );
}
