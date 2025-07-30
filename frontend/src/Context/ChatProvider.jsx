import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { getChatList, getChatMessages } from "../Api/chat.api";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);
export const ChatProvider = ({ children }) => {
  const { user_type, user_id, agency_id } = useSelector(
    (state) => state.auth.userProfile
  );
  const userId = user_type === "agency" ? agency_id : user_id;

  // Local states
  // Chat list state
  const [chatList, setChatList] = useState([]);
  const [chatListLoading, setChatListLoading] = useState(false);
  const [chatListError, setChatListError] = useState(null);
  // Active chat and messages state
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // Ref to hold the socket instance
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    setChatListLoading(true);
    setChatListError(null);
    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });
    socketRef.current.on("connect", () =>
      console.log("Socket connected:", socketRef.current.id)
    );

    // Fetch chat list via REST
    getChatList(userId)
      .then((chats) => {
        setChatList(Array.isArray(chats) ? chats : []);
        setChatListLoading(false);
        // Join chat rooms for real-time updates
        const chatIds = (Array.isArray(chats) ? chats : []).map(
          (chat) => chat._id
        );
        socketRef.current.emit("joinRooms", { userId, chatIds });
      })
      .catch((err) => {
        console.error("Error fetching chats:", err);
        setChatList([]); // Always set to empty array on error
        setChatListError(err.message || "Error fetching chats");
        setChatListLoading(false);
      });
    // Cleanup on unmount
    return () => socketRef.current.disconnect();
  }, [userId]);

  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    fetchMessages(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [activeChatId]);

  const fetchMessages = async (chatId, beforeDate = null, append = false) => {
    if (!chatId) return;
    try {
      setMessagesLoading(true);
      const res = await getChatMessages(chatId, beforeDate);
      const newMessages = res.messages || [];

      setMessages((prev) => {
        if (append) {
          return [...newMessages, ...prev];
        } else {
          return newMessages;
        }
      });

      setHasMoreMessages(res.hasMore);
      setMessagesError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessagesError(err.message || "Error fetching messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    if (message.chatId === activeChatId) {
      setMessages((prev) => {
        const existingIndex = prev.findIndex(
          (msg) => msg.front_id === message.tempId
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...message,
            status: "sent",
          };
          return updated;
        }

        return [...prev, message];
      });
    }
    // Update chat list: last message and unseen count
    setChatList((prev) =>
      prev.map((chat) =>
        chat._id === message.chatId
          ? {
              ...chat,
              lastMessage: {
                text: message.text,
                timestamp: message.timestamp,
                senderName: message.sender.fullName,
              },
              unseenCount:
                chat._id === activeChatId ? 0 : (chat.unseenCount || 0) + 1,
            }
          : chat
      )
    );
  };

  const sendMessage = (text) => {
    if (!activeChatId || !text.trim()) return;
    const tempId = uuidv4();
    const optimisticMessage = {
      front_id: tempId,
      chatId: activeChatId,
      senderId: userId,
      text,
      status: "sending",
      timestamp: new Date(),
      sender: { senderId: userId, fullName: "You" },
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    socketRef.current.emit("sendMessage", { ...optimisticMessage, tempId });
  };

  // Set ActiveChatId for a trip
  const activateTripsChat = (tripId) => {
    if (!tripId) return;
    const chat = chatList.find((chat) => chat.tripId === tripId);
    if (chat) {
      setActiveChatId(chat._id);
    } else {
      console.error("No chat found for this trip");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        userId,
        chatList,
        chatListLoading,
        chatListError,
        activeChatId,
        setActiveChatId,
        messages,
        messagesLoading,
        messagesError,
        sendMessage,
        fetchMessages,
        hasMoreMessages,
        // activateTripsChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
