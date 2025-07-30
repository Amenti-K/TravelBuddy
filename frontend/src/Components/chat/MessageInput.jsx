import React, { useState, useRef } from "react";
import { TextInput, ActionIcon, Popover } from "@mantine/core";
import { FaMessage, FaRegFaceSmile } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { useChat } from "../../Context/ChatProvider";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [emojiOpened, setEmojiOpened] = useState(false);
  const inputRef = useRef();
  const { sendMessage } = useChat();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setEmojiOpened(false);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 px-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Popover
          opened={emojiOpened}
          onChange={setEmojiOpened}
          position="top-start"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              onClick={() => setEmojiOpened((o) => !o)}
            >
              <FaRegFaceSmile size={20} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown className="max-h-64 overflow-y-auto">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={300} />
          </Popover.Dropdown>
        </Popover>

        <TextInput
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          radius="md"
          size="md"
          className="flex-1"
          leftSection={<FaMessage size={18} />}
        />

        <ActionIcon
          variant="filled"
          color="blue"
          onClick={handleSend}
          size="lg"
          disabled={!text.trim()}
        >
          <IoIosSend size={20} />
        </ActionIcon>
      </div>
    </div>
  );
}
