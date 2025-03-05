import "../assets/styles/chat/chat.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Avatar, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { accessChat, getAllConversations } from "../redux/recentChat/action";
import { selectConversation } from "../redux/chatting/action";
import { NotificationComp } from "../components/NotificationComp";
import { setUserActive } from "../redux/activeUser/action";
import { searchUsersAndConversations } from '../redux/search/action';

export const MyChat = ({ socket }) => {
  const [search, setSearch] = useState(false);
  
  // Update Redux selectors
  const { users, conversations, loading: searchLoading } = useSelector(
    (store) => store.search
  );
  const { allConversations, loading: chatLoading } = useSelector(
    (store) => store.recentChat
  );
  const { activeConversation } = useSelector((store) => store.conversation);
  const { notification, unseenmsg } = useSelector(
    (store) => store.notification
  );

  // call api to get all conversations
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllConversations());
  }, []);

  // Add useEffect for status updates
  useEffect(() => {
    if (!socket) {
      return;
    };

    socket.on("user:status", ({ userId, status, timestamp }) => {
      dispatch(setUserActive({ userId, status, timestamp }));
    });

    return () => {
      socket.off("user:status");
    };
  }, [socket, dispatch]);

  // handle search action when user type in search bar
  const ref = useRef();
  const handleSearchQuery = (e) => {
    if (!e.target.value.trim()) {
      setSearch(false);
      return;
    }
    setSearch(true);
    dispatch(searchUsersAndConversations(e.target.value.trim()));
  };

  return (
    <div className="mychat-cont">
      <div>
        <div className="notification">
          <h2>Chats</h2>
          <Badge badgeContent={notification} color="error">
            <NotificationComp />
          </Badge>
        </div>
        <div className="search-cont">
          <SearchIcon />
          <input
            onChange={handleSearchQuery}
            type="text"
            placeholder="Search users or conversations"
          />
        </div>
      </div>
      <div className="recent-chat">
        {search ? (
          <div className="search-results">
            {searchLoading ? (
              <div className="loading">Searching...</div>
            ) : (
              <>
                {users.length > 0 && (
                  <div className="search-section">
                    <p className="Recent">Users</p>
                    {users.map((user) => (
                      <SearchUserComp
                        key={user.user_id}
                        user={user}
                        setSearch={setSearch}
                      />
                    ))}
                  </div>
                )}
                {conversations.length > 0 && (
                  <div className="search-section">
                    <p className="Recent">Conversations</p>
                    {conversations.map((conversation) => (
                      <ChatUserComp
                        key={conversation.conversation_id}
                        conversation={conversation}
                        activeConversation={activeConversation}
                      />
                    ))}
                  </div>
                )}
                {users.length === 0 && conversations.length === 0 && (
                  <div className="no-results">No results found</div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <p className="Recent">Recent</p>
            <div className="recent-user">
              {!chatLoading &&
                allConversations.map((conversation) => (
                  <ChatUserComp
                    key={conversation.conversation_id}
                    conversation={conversation}
                    activeConversation={activeConversation}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ChatUserComp = ({ conversation, activeConversation }) => {
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

// Add new SearchUserComp for displaying user search results
const SearchUserComp = ({ user, setSearch }) => {
  const dispatch = useDispatch();

  const handleSelectUser = async () => {
    try {
      await dispatch(accessChat(user.user_id));
      setSearch(false);
    } catch (error) {
      console.error('Error accessing chat:', error);
    }
  };

  return (
    <div onClick={handleSelectUser} className="user">
      <div className="history-cont">
        <div className="avatar-container">
          <Avatar src={user.avatar_url} />
        </div>
        <div>
          <p className="name">{user.username}</p>
        </div>
      </div>
    </div>
  );
};


