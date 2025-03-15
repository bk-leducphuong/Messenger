import "../assets/styles/conversation/conversation.css";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectConversation } from "../redux/chatting/action";

export const UserConversation = ({ conversation, activeConversation }) => {
  const { activeUsers } = useSelector((store) => store.activeUser);

  const dispatch = useDispatch();
  const handleSelectConversation = () => {
    dispatch(selectConversation(conversation));
  };

  // Get the participant's online status
  const isOnline = conversation.conversation_type !== "group" && 
    activeUsers[conversation.participants[0].user_id]?.status === "online";

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
        <p className="unseen-chat">5</p>
      </div>
    </div>
  );
};