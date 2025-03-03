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
import io from "socket.io-client";

var socket, currentChattingWith;

export const ChattingPage = () => {
  const { user } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.conversation);
  var { unseenmsg } = useSelector((store) => store.notification);
  const { activeConversation } = useSelector((store) => store.conversation);
  const scrolldiv = createRef();
  const socketRef = useRef();
  const dispatch = useDispatch();

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_API);
    socketRef.current.emit("setup", user);
    socketRef.current.on("connected", () => {
      console.log("Socket connected");
    });

    // Cleanup socket connection
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // fetch messages
  useEffect(() => {
    if (!activeConversation?.conversation_id) return;
    dispatch(
      fetchConversationMessage(activeConversation.conversation_id, socketRef.current)
    );
  }, [dispatch, activeConversation]);

  // Handle incoming messages
  useEffect(() => {
    if (!socketRef.current) return;

    const messageHandler = (newMessage) => {
      if (!activeConversation || activeConversation.conversation_id !== newMessage.conversation_id) {
        // Play notification sound
        handleNotyfy(newMessage);
      } else {
        dispatch(sendMessage(newMessage));
      }
    };

    socketRef.current.on("message:new", messageHandler);

    return () => {
      socketRef.current.off("message:new", messageHandler);
    };
  }, [activeConversation, dispatch]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrolldiv.current && messages.length > 0) {
      scrolldiv.current.scrollTop = scrolldiv.current.scrollHeight;
    }
  }, [messages]);

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
      <div className="sender-cont">
        <InputContWithEmog conversationId={activeConversation.conversation_id} socket={socketRef.current} />
      </div>
    </div>
  );
};
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

function InputContWithEmog({ conversationId, socket }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

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
  }

  return (
    <>
      <div className="search-cont send-message">
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={handleOnEnter}
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
