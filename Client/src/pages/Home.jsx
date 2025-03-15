import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ChattingPage } from "../components/ChattingPage";
import { MyChat } from "./Chat";
import { SideNavbar } from "../components/SideNavbar";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Function to update user status via API
const updateUserStatusAPI = async (userId, status) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

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

    socketRef.current.on("connect", async () => {
      console.log("Connected to socket server");
      setSocket(socketRef.current);

      // Update status to online in both socket and database
      socketRef.current.emit("user:activity", {
        userId: user.user_id,
        status: "online",
      });
      await updateUserStatusAPI(user.user_id, "online");
    });

    // Handle window close/refresh
    const handleBeforeUnload = async () => {
      socketRef.current?.emit("user:activity", {
        userId: user.user_id,
        status: "offline",
      });
      await updateUserStatusAPI(user.user_id, "offline");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (socketRef.current) {
        // Update status to offline in both socket and database
        socketRef.current.emit("user:activity", {
          userId: user.user_id,
          status: "offline",
        });
        // Note: We can't await this in the cleanup function
        updateUserStatusAPI(user.user_id, "offline");
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
