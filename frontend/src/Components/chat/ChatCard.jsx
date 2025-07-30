import React from "react";
import { Card, Text, Badge } from "@mantine/core";
import ProfileAvatarComp from "../custom/ProfileAvatarComp";
import { useChat } from "../../Context/ChatProvider";

const ChatCard = ({ chat, isActive }) => {
  const { _id, name, chat_picture, lastMessage, unseenCount } = chat;
  const { setActiveChatId } = useChat();

  const time = lastMessage
    ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Card
      withBorder
      shadow={isActive ? "md" : "sm"}
      onClick={() => setActiveChatId(_id)}
      className={`w-full p-2 rounded-lg cursor-pointer transition-all border
        ${
          isActive
            ? "bg-blue-100 dark:bg-blue-900 border-blue-400"
            : "bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-300 dark:border-zinc-700"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <ProfileAvatarComp name={name} picture={chat_picture} />

        {/* Chat Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center w-full">
            <Text
              size="md"
              fw={500}
              className="truncate text-zinc-900 dark:text-white"
            >
              {name}
            </Text>
            {time && (
              <Text
                size="xs"
                className="ml-2 whitespace-nowrap text-gray-600 dark:text-gray-400"
              >
                {time}
              </Text>
            )}
          </div>

          <Text size="sm" className="truncate text-gray-700 dark:text-gray-300">
            {lastMessage?.senderName ? (
              <>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {lastMessage.senderName.split(" ")[0]}:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-300">
                  {lastMessage.text}
                </span>
              </>
            ) : (
              <span className="text-gray-600 dark:text-gray-300">No messages yet</span>
            )}
          </Text>
        </div>

        {/* Unseen Message Count */}
        {unseenCount > 0 && (
          <Badge size="sm" color="blue" variant="filled">
            {unseenCount}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default ChatCard;
