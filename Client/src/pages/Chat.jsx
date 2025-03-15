import "../assets/styles/chat/chat.css";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { accessChat, getAllConversations } from "../redux/recentChat/action";
import { selectConversation } from "../redux/chatting/action";
import { NotificationComp } from "../components/NotificationComp";
import { setUserActive } from "../redux/activeUser/action";
import { searchUsersAndConversations } from '../redux/search/action';
import { SearchUserComp } from "../components/SearchComp";
import { UserConversation } from "../components/UserConversation";

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
                      <UserConversation
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
                  <UserConversation
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






