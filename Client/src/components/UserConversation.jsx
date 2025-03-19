import "../assets/styles/conversation/conversation.css";
import { Avatar, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectConversation } from "../redux/chatting/action";
import { removeSeenMsg } from "../redux/notification/action";

export const UserConversation = ({ conversation, activeConversation }) => {
  const { activeUsers } = useSelector((store) => store.activeUser);
  const { unseenmsg } = useSelector((store) => store.notification);
  
  const dispatch = useDispatch();
  
  // Count unseen messages for this conversation
  const unseenCount = unseenmsg?.filter(
    msg => msg.conversation_id === conversation.conversation_id
  ).length || 0;
  
  const handleSelectConversation = () => {
    dispatch(selectConversation(conversation));
    
    // Clear unseen messages for this conversation when selected
    if (unseenCount > 0) {
      const updatedUnseenMsgs = unseenmsg.filter(
        msg => msg.conversation_id !== conversation.conversation_id
      );
      dispatch(removeSeenMsg(updatedUnseenMsgs));
    }
  };

  // Get the participant's online status
  const isOnline = conversation.conversation_type !== "group" && 
    activeUsers[conversation.participants[0].user_id]?.status === "online" || conversation.participants[0].status === "online"

  return (
    <div
      onClick={handleSelectConversation}
      className={conversation.conversation_id == activeConversation.conversation_id ? "user selectUser" : "user"}
    >
      <div className="history-cont">
        <div className="avatar-container">
          {conversation.conversation_type === "group" ? (
            <Avatar>G</Avatar>
          ) : (
            <>
              <Avatar src={conversation.participants[0].avatar_url} />
              <div className={`status-indicator ${isOnline ? 'status-online' : 'status-offline'}`} />
            </>
          )}
        </div>
        <div>
          <p className="name">{conversation.conversation_name}</p>
          <p className="chat">
            {conversation.latest_message
              ? conversation.latest_message.message_text.length > 8
                ? conversation.latest_message.message_text.substring(0, 30) + " . . ."
                : conversation.latest_message.message_text
              : ""}
          </p>
        </div>
      </div>
      <div>
        {conversation.latest_message ? (
          <p className="time">
            {new Date(conversation.latest_message.updated_at).getHours() +
              ":" +
              new Date(conversation.latest_message.updated_at).getMinutes()}
          </p>
        ) : (
          ""
        )}
        {unseenCount > 0 && (
          <div className="unseen-chat">{unseenCount}</div>
        )}
      </div>
    </div>
  );
};