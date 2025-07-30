import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../../App";
import { ChatProvider } from "../../Context/ChatProvider";

const ChatLayer = () => {
  return (
    <ProtectedRoute>
      <ChatProvider>
        <Outlet />
      </ChatProvider>
    </ProtectedRoute>
  );
};

export default ChatLayer;
