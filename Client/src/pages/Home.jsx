import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ChattingPage } from "../components/ChattingPage";
import { MyChat } from "./Chat";
import { SideNavbar } from "../components/SideNavbar";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const HomeComp = () => {
  const { user, loading, error } = useSelector((store) => store.user);
  const { activeConversation } = useSelector((store) => store.conversation);
  const socketRef = useRef();
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.user_id) return;

    // Connect to socket server
    socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
      setSocket(socketRef.current);
    });
    
    // Send initial online status
    socketRef.current.emit("user:activity", {
      userId: user.user_id,
      status: "online"
    });

    // Handle window close/refresh
    const handleBeforeUnload = () => {
      socketRef.current?.emit("user:activity", {
        userId: user.user_id,
        status: "offline"
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (socketRef.current) {
        socketRef.current.emit("user:activity", {
          userId: user.user_id,
          status: "offline"
        });
        socketRef.current.disconnect();
        setSocket(null);
      }
    };
  }, [user]);

  return (
    <div className="home-cont">
      <SideNavbar />
      <MyChat socket={socket} />
      {activeConversation.conversation_id ? (
        <ChattingPage socket={socket} />
      ) : (
        <MessageStarter {...user} />
      )}
    </div>
  );
};

const MessageStarter = ({ username, avatar_url }) => {
  return (
    <div className="chattingpage start-msg">
      <div>
        <Avatar src={avatar_url} sx={{ width: 70, height: 70 }} />
        <h3>Welcome, {username}</h3>
        <p>Please select a chat to start messaging.</p>
      </div>
    </div>
  );
};
