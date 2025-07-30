import React from "react";
import { useNavigate } from "react-router-dom";
import { Text, ActionIcon, Group, Badge } from "@mantine/core";
import { FaArrowLeft } from "react-icons/fa";
import { useChat } from "../../Context/ChatProvider";
import ProfileAvatarComp from "../custom/ProfileAvatarComp";

const ChatRoomTopBar = () => {
  const { activeChatId, setActiveChatId, chatList } = useChat();
  const navigate = useNavigate();

  const activeChat = chatList.find((chat) => chat._id === activeChatId);
  if (!activeChat) return null;

  const { name, chat_picture, tripId } = activeChat;

  return (
    <div className="flex items-center justify-between h-16 px-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <Group spacing="xs">
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => setActiveChatId(null)}
        >
          <FaArrowLeft />
        </ActionIcon>

        <div
          onClick={() => navigate(`/discover/mytrips/${tripId}`)}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <ProfileAvatarComp name={name} picture={chat_picture} />
          <div className="flex flex-col">
            <Text
              size="md"
              fw={400}
              lineClamp={1}
              className="truncate dark:text-white"
            >
              {name}
            </Text>
            <Badge color="gray" size="xs" variant="light">
              Trip Chat
            </Badge>
          </div>
        </div>
      </Group>
    </div>
  );
};

export default ChatRoomTopBar;
