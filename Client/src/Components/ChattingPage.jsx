import { Avatar, Button, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styled from "@emotion/styled";
import SendIcon from "@mui/icons-material/Send";
import InputEmoji from "react-input-emoji";
import React, {
  useRef,
  createRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ChatlogicStyling, isSameSender } from "./ChatstyleLogic";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversationMessage,
  sendMessageApi,
} from "../redux/chatting/action";
import { sendMessage } from "../redux/chatting/action";
import { addUnseenMsg } from "../redux/notification/action";
import { updateConversationWithNewMessage } from "../redux/recentChat/action";
import { debounce } from "lodash";
import CallModal from "./call/CallModal";
import IncomingCallModal from "./call/IncomingCallModal";
import { initNotificationSound, playNotificationSound } from "../utils/soundUtils";
import ImageIcon from "@mui/icons-material/Image";
import CircularProgress from "@mui/material/CircularProgress";

export const ChattingPage = ({ socket }) => {
  const { user } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.conversation);
  var { unseenmsg } = useSelector((store) => store.notification);
  const { activeConversation } = useSelector((store) => store.conversation);
  const scrolldiv = createRef();
  const dispatch = useDispatch();
  const [typingUsers, setTypingUsers] = useState({});
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  // Initialize notification sound when component mounts
  useEffect(() => {
    initNotificationSound().catch(error => {
      console.warn("Failed to initialize notification sound:", error);
    });
    
    // Cleanup when component unmounts
    return () => {
      // Any necessary cleanup
    };
  }, []);

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
      if (
        !activeConversation ||
        activeConversation.conversation_id !== newMessage.conversation_id
      ) {
        // Create and dispatch notification
        handleNotificationForNewMessage(newMessage);
        
        // Update recent chat with new message
        dispatch(updateConversationWithNewMessage(newMessage));
      } else {
        dispatch(sendMessage(newMessage));
        
        // Even when in the active conversation, update recent chat order
        dispatch(updateConversationWithNewMessage(newMessage));
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
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: {
          userName,
          isTyping,
        },
      }));
    });

    return () => {
      socket.off("typing:update");
    };
  }, [socket]);

  // Add new useEffect for call handling
  useEffect(() => {
    if (!socket) return;

    // Listen for incoming calls
    socket.on("call:incoming", ({ offer, callType, callerId, callerName }) => {
      setIncomingCall({
        offer,
        callType,
        callerId,
        callerName,
      });
    });

    // Listen for call ended
    socket.on("call:ended", () => {
      setIsCallModalOpen(false);
      setIncomingCall(null);
    });

    socket.on("call:rejected", () => {
      setIsCallModalOpen(false);
    });

    return () => {
      socket.off("call:incoming");
      socket.off("call:ended");
    };
  }, [socket]);

  const handleAcceptCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incomingCall.callType === 'video'
      });

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Add stream
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Set remote description (offer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));

      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer to caller
      socket.emit('call:accept', {
        answer,
        callerId: incomingCall.callerId
      });

      // Open call modal
      setCallType(incomingCall.callType);
      setIsCallModalOpen(true);
      setIncomingCall(null);

    } catch (error) {
      console.error('Error accepting call:', error);
      handleRejectCall();
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      socket.emit('call:reject', { callerId: incomingCall.callerId });
      setIncomingCall(null);
    }
  };

  const getTypingIndicator = () => {
    const typing = Object.values(typingUsers).filter((user) => user.isTyping);
    if (typing.length === 0) return null;

    if (typing.length === 1) {
      return `${typing[0].userName} is typing...`;
    }
    return `${typing.length} people are typing...`;
  };

  const handleNotificationForNewMessage = (newMessage) => {
    // Format the notification data to match what NotificationComp expects
    const notificationData = {
      sender: {
        name: newMessage.sender_name || "Someone",
      },
      content: newMessage.message_text,
      conversation_id: newMessage.conversation_id,
      message_id: newMessage.message_id,
      timestamp: newMessage.created_at,
    };
    
    // Play notification sound if needed
    playNotificationSound().catch(error => {
      console.log("Could not play notification sound:", error.message);
      // Try to initialize and play again
      initNotificationSound()
        .then(() => playNotificationSound())
        .catch(e => console.error("Failed to initialize and play sound:", e));
    });
    
    // Dispatch action to add to unseen messages
    dispatch(addUnseenMsg(notificationData));
  };

  const handleVideoCall = () => {
    setCallType("video");
    setIsCallModalOpen(true);
  };

  const handleAudioCall = () => {
    setCallType("audio");
    setIsCallModalOpen(true);
  };

  return (
    <>
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
              <CallIcon onClick={handleAudioCall} />
              <VideoCallIcon onClick={handleVideoCall} />
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
                  ? "rightuser-chat"
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
                  {message.message_type === 'image' ? (
                    <>
                      <img 
                        src={message.fileUrl} 
                        alt="Message attachment" 
                        className="image-message" 
                        onClick={() => window.open(message.fileUrl, '_blank')}
                      />
                      {message.message_text && <p>{message.message_text}</p>}
                    </>
                  ) : (
                    <p>{message.message_text}</p>
                  )}
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
          <div className="typing-indicator">{getTypingIndicator()}</div>
        )}

        <div className="sender-cont">
          <InputContWithEmog
            user={user}
            conversationId={activeConversation.conversation_id}
            socket={socket}
          />
        </div>
      </div>

      <CallModal
        isOpen={isCallModalOpen}
        callType={callType}
        caller={user}
        receiver={activeConversation.participants[0]}
        onClose={() => setIsCallModalOpen(false)}
        socket={socket}
      />

      <IncomingCallModal
        isOpen={!!incomingCall}
        callType={incomingCall?.callType}
        callerName={incomingCall?.callerName}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </>
  );
};
function InputContWithEmog({ user, conversationId, socket }) {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { imageUploading } = useSelector((store) => store.conversation);

  // Add debounce to avoid too many typing events
  const handleTyping = useCallback(
    debounce(() => {
      if (socket) {
        socket.emit("typing:start", { conversationId, user });
      }
    }, 500),
    [socket, conversationId, user]
  );

  // Add handler for stopping typing
  const handleStopTyping = useCallback(() => {
    if (socket) {
      socket.emit("typing:stop", { conversationId, user });
    }
  }, [socket, conversationId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif")) {
      setSelectedImage(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      alert("Please select a valid image file (JPEG, PNG, or GIF)");
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function handleOnEnter(text) {
    if (text.trim() || selectedImage) {
      dispatch(
        sendMessageApi(
          {
            messageText: text,
            conversationId: conversationId,
            messageType: selectedImage ? "image" : "text",
            fileUrl: null,
            file: selectedImage,
          },
          socket
        )
      );
      handleStopTyping();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }

  function handleChatClick() {
    if (text.trim() || selectedImage) {
      dispatch(
        sendMessageApi(
          {
            messageText: text || "",
            conversationId: conversationId,
            messageType: selectedImage ? "image" : "text",
            fileUrl: null,
            file: selectedImage,
          },
          socket
        )
      );
      setText("");
      handleStopTyping();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }

  const handleTextChange = (newText) => {
    setText(newText);
    handleTyping(); // Emit typing event when text changes
  };

  return (
    <>
      {imagePreview && (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={imagePreview} alt="Selected" />
            <button className="cancel-image-btn" onClick={handleCancelImage}>×</button>
          </div>
        </div>
      )}
      <div className="search-cont send-message">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/jpeg,image/png,image/gif"
        />
        <IconButton 
          onClick={handleImageUploadClick}
          disabled={imageUploading}
          className="image-upload-btn"
        >
          {imageUploading ? <CircularProgress size={24} /> : <ImageIcon />}
        </IconButton>
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
        disabled={imageUploading}
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
