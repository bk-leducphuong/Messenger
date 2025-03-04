import { Avatar, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styled from "@emotion/styled";
import SendIcon from "@mui/icons-material/Send";
import InputEmoji from "react-input-emoji";
import React, { useRef, createRef, useCallback, useEffect, useState } from "react";
import { ChatlogicStyling, isSameSender } from "./ChatstyleLogic";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversationMessage,
  sendMessageApi,
} from "../redux/chatting/action";
import { sendMessage } from "../redux/chatting/action";
import { addUnseenmsg } from "../redux/notification/action";
import { debounce } from "lodash";

export const ChattingPage = ({ socket }) => {
  const { user } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.conversation);
  var { unseenmsg } = useSelector((store) => store.notification);
  const { activeConversation } = useSelector((store) => store.conversation);
  const scrolldiv = createRef();
  const dispatch = useDispatch();
  const [typingUsers, setTypingUsers] = useState({});

  // fetch messages
  useEffect(() => {
    if (!activeConversation?.conversation_id) return;
    dispatch(
      fetchConversationMessage(activeConversation.conversation_id, socket)
    );
  }, [dispatch, activeConversation]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    const messageHandler = (newMessage) => {
      if (!activeConversation || activeConversation.conversation_id !== newMessage.conversation_id) {
        // Play notification sound
        handleNotyfy(newMessage);
      } else {
        dispatch(sendMessage(newMessage));
      }
    };

    socket.on("message:new", messageHandler);

    return () => {
      socket.off("message:new", messageHandler);
    };
  }, [activeConversation, dispatch, socket]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrolldiv.current && messages.length > 0) {
      scrolldiv.current.scrollTop = scrolldiv.current.scrollHeight;
    }
  }, [messages]);

  // Add this new useEffect for typing status
  useEffect(() => {
    if (!socket) return;

    socket.on("typing:update", ({ userId, userName, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [userId]: {
          userName,
          isTyping
        }
      }));
    });

    return () => {
      socket.off("typing:update");
    };
  }, [socket]);

  const getTypingIndicator = () => {
    const typing = Object.values(typingUsers).filter(user => user.isTyping);
    if (typing.length === 0) return null;
    
    if (typing.length === 1) {
      return `${typing[0].userName} is typing...`;
    }
    return `${typing.length} people are typing...`;
  };

  const handleNotyfy = (newMessage) => {
    dispatch(addUnseenmsg(newMessage));
  };

  return (
    <div className="chattingpage">
      <div className="top-header">
        <div className="user-header">
          <Avatar
            src={
              activeConversation.conversation_type == "group"
                ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                : activeConversation.participants[0].avatar_url
            }
          />
          <p className="user-name">{activeConversation.conversation_name}</p>
        </div>
        <div>
          <div className="user-fet">
            <SearchIcon />
            <CallIcon />
            <VideoCallIcon />
            <MoreHorizIcon />
          </div>
        </div>
      </div>
      <div ref={scrolldiv} className="live-chat">
        {messages.map((message, index) => (
          <div
            key={message.message_id || index}
            className={
              message.sender_id != user.user_id
                ? "rihgtuser-chat"
                : "leftuser-chat"
            }
          >
            <div
              className={
                message.sender_id != user.user_id ? "right-avt" : "left-avt"
              }
            >
              <div
                className={ChatlogicStyling(message.sender_id, user.user_id)}
              >
                <p>{message.message_text}</p>
                <p className="time chat-time">
                  {new Date(message.created_at).getHours() +
                    ":" +
                    new Date(message.created_at).getMinutes()}
                </p>
              </div>

              {isSameSender(messages, index) ? (
                <Avatar
                  src={
                    message.sender_id != user.user_id
                      ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      : user.avatar_url
                  }
                />
              ) : (
                <div className="blank-div"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add typing indicator above the input */}
      {getTypingIndicator() && (
        <div className="typing-indicator">
          {getTypingIndicator()}
        </div>
      )}
      
      <div className="sender-cont">
        <InputContWithEmog 
          user={user} 
          conversationId={activeConversation.conversation_id} 
          socket={socket}
        />
      </div>
    </div>
  );
};
function InputContWithEmog({ user, conversationId, socket }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  
  // Add debounce to avoid too many typing events
  const handleTyping = useCallback(
    debounce(() => {
      if (socket) {
        console.log("typing:start", { conversationId, user });
        socket.emit("typing:start", { conversationId, user });
      }
    }, 500),
    [socket, conversationId, user]
  );

   // Add handler for stopping typing
  const handleStopTyping = useCallback(() => {
    if (socket) {
      socket.emit("typing:stop", { conversationId });
    }
  }, [socket, conversationId]);

  function handleOnEnter(text) {
    dispatch(
      sendMessageApi(
        {
          messageText: text,
          conversationId: conversationId,
          messageType: "text",
          fileUrl: null,
        },
        socket
      )
    );
    handleStopTyping();
  }

  function handleChatClick() {
    dispatch(
      sendMessageApi(
        {
          messageText: text,
          conversationId: conversationId,
          messageType: "text",
          fileUrl: null,
        },
        socket
      )
    );
    setText("");
    handleStopTyping();
  }

  const handleTextChange = (newText) => {
    setText(newText);
    handleTyping(); // Emit typing event when text changes
  };

  return (
    <>
      <div className="search-cont send-message">
        <InputEmoji
          value={text}
          onChange={handleTextChange}
          cleanOnEnter
          onEnter={handleOnEnter}
          onBlur={handleStopTyping}
          placeholder="Type a message"
        />
      </div>
      <ColorButton
        onClick={handleChatClick}
        variant="contained"
        endIcon={<SendIcon />}
      ></ColorButton>
    </>
  );
}

const ColorButton = styled(Button)(() => ({
  color: "white",
  fontSize: "20px",
  textTransform: "none",
  padding: "12px",
  marginRight: "15px",
  backgroundColor: "#5865f2",
  "&:hover": {
    backgroundColor: "#3a45c3",
  },
}));
