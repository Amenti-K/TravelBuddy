import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../Context/ChatProvider";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import ChatRoomTopBar from "./ChatRoomTopBar";
import { Skeleton, Text, Button } from "@mantine/core";
import dayjs from "dayjs";
import { ChatRoomSkeleton } from "../common/Skeletons";

const ChatRoom = ({ tripId }) => {
  const {
    activeChatId,
    messages,
    messagesLoading,
    messagesError,
    fetchMessages,
    hasMoreMessages,
    activateTripsChat,
  } = useChat();

  // Activate the chat for the current trip
  if (tripId) {
    activateTripsChat(tripId);
  }

  const scrollContainerRef = useRef(null);
  const previousScrollHeightRef = useRef(0);
  const topObserverRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom on mount and when new messages arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      if (isAtBottom) {
        // Stay at the bottom if user is at bottom
        container.scrollTop = container.scrollHeight;
      } else if (previousScrollHeightRef.current) {
        // Adjust scroll position to compensate for new messages above
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
        container.scrollTop += scrollDiff;

        // Clear the reference
        previousScrollHeightRef.current = 0;
      }
    }
  }, [messages]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreMessages && !messagesLoading) {
          const oldestMessage = messages[0];
          if (oldestMessage && scrollContainerRef.current) {
            previousScrollHeightRef.current =
              scrollContainerRef.current.scrollHeight;
            fetchMessages(activeChatId, oldestMessage.timestamp, true);
          }
        }
      },
      { threshold: 1 }
    );

    if (topObserverRef.current) {
      observer.observe(topObserverRef.current);
    }

    return () => {
      if (topObserverRef.current) {
        observer.unobserve(topObserverRef.current);
      }
    };
  }, [messages, hasMoreMessages, messagesLoading]);

  // Handle scroll position
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
  };

  // Group messages by date
  const renderMessagesWithDateDividers = () => {
    const elements = [];
    let lastDate = null;

    messages.forEach((msg) => {
      const msgDate = dayjs(msg.timestamp);
      const formattedDate = msgDate.format("MMM D").toUpperCase();

      if (formattedDate !== lastDate) {
        elements.push(
          <div key={`divider-${formattedDate}`} className="text-center my-2">
            <Text size="xs" color="dimmed">
              {formattedDate}
            </Text>
          </div>
        );
        lastDate = formattedDate;
      }
      elements.push(
        <MessageItem key={msg._id || msg.front_id} message={msg} />
      );
    });
    return elements;
  };

  const chatRoomSkeleton = Array.from({ length: 1 }).map((_, idx) => (
    <ChatRoomSkeleton key={idx} />
  ));

  return (
    <div className="flex flex-col h-screen dark:bg-gray-800 bg-white">
      <ChatRoomTopBar />
      {activeChatId ? (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto space-y-2 px-6 pt-4"
        >
          <div ref={topObserverRef}></div>
          {messagesLoading && messages.length === 0 ? (
            chatRoomSkeleton
          ) : messagesError ? (
            <div className="text-center mt-4">
              <Text color="red">{messagesError}</Text>
              <Button onClick={() => fetchMessages(activeChatId)}>Retry</Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center mt-4">
              <Text color="dimmed">
                Start a conversation with your fellow travelers
              </Text>
            </div>
          ) : (
            renderMessagesWithDateDividers()
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Text color="dimmed">No chat selected</Text>
        </div>
      )}
      <MessageInput />
    </div>
  );
};

export default ChatRoom;
