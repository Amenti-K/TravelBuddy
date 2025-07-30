import React from "react";
import { Text } from "@mantine/core";
import { useChat } from "../../Context/ChatProvider";
import ProfileAvatarComp from "../custom/ProfileAvatarComp";

export default function MessageItem({ message }) {
  const { user_id } = useChat();
  // const user_id = "uuid2";
  const isOwn = message.sender.senderId === user_id;
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col w-full mb-2 justify-start ${
        isOwn ? "items-end" : "items-start"
      }`}
    >
      <div className="flex gap-2 max-w-75%">
        {!isOwn && (
          <ProfileAvatarComp
            name={message.sender.fullName}
            picture={message.sender.profilePicture}
          />
        )}
        <div className="flex flex-col gap-1">
          <div
            className={`max-w-xs px-3 py-2 rounded-lg 
        ${
          isOwn
            ? "bg-blue-300 text-white"
            : "bg-gray-200 dark:bg-gray-600 text-black dark:text-gray-200"
        }
      `}
          >
            {!isOwn && (
              <Text size="xs" weight={500} className="mb-1" color="blue">
                {message.sender.fullName}
              </Text>
            )}
            <Text size="sm">{message.text}</Text>
          </div>
          <Text size="xs" color="dimmed" className="mt-1 text-right">
            {time}
            {isOwn && (
              <span className="ml-1 text-gray-500 text-xs">
                {message.status === "sending" ? "⏳" : "✔️"}
              </span>
            )}
          </Text>
        </div>
      </div>
    </div>
  );
}
