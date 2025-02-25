import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Avatar, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeSearchApi } from "../redux/searching/action";
import { accessChat, getAllConversations } from "../redux/recentChat/action";
import { selectConversation } from "../redux/chatting/action";
import { SearchComp } from "../components/SearchComp";
import { NotificationComp } from "../components/NotificationComp";

export const MyChat = () => {
  // state component
  const [search, setSearch] = useState(false);

  // redux store
  const { search_result, loading, error } = useSelector(
    (store) => store.search
  );
  const { allConversations, loading: chatLoading } = useSelector( // recent_chat = {id, }
    (store) => store.recentChat
  );
  const {  activeConversation } = useSelector((store) => store.conversation);
  const { notification, unseenmsg } = useSelector(
    (store) => store.notification
  );

  // call api to get all conversations
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllConversations());
  }, []);

  // handle search action when user type in search bar
  const ref = useRef();
  const handleQuery = (e) => {
    let id;
    return function (e) {
      if (!e.target.value) {
        setSearch(false);
        return;
      }
      if (ref.current) clearTimeout(ref.current);
      setSearch(true);
      ref.current = setTimeout(() => {
        dispatch(makeSearchApi(e.target.value));
      }, 1000);
    };
  };

  return (
    <div className="mychat-cont">
      <div>
        <div className="notification">
          <h2>Chats</h2>
          {/* <NotificationsIcon /> */}
          <Badge badgeContent={notification} color="error">
            <NotificationComp />
          </Badge>
          {/* <AddIcon /> */}
        </div>
        <div className="search-cont">
          <SearchIcon />
          <input
            onChange={handleQuery()}
            type="text"
            placeholder="Search users"
          />
        </div>
      </div>
      <div className="recent-chat">
        <p className="Recent">Recent</p>
        <div className="recent-user">
          {search
            ? search_result.map((el) => (
                <SearchComp
                  key={el.id}
                  {...el}
                  token={token}
                  recent_chat={recent_chat}
                  setSearch={setSearch}
                />
              ))
            : !chatLoading &&
              allConversations.map((conversation, index) => (
                <ChatUserComp
                  key={conversation.conversation_id}
                  {...conversation}
                  activeConversation={activeConversation}
                />
              ))}
        </div>
      </div>
    </div>
  );
};


const ChatUserComp = (conversation, activeConversation) => {
  const dispatch = useDispatch();
  const handleSelectConversation = () => {
    dispatch(
      selectConversation(conversation)
    );
  };
  return (
    <div
      onClick={handleSelectConversation}
      class="user"
      className={ conversation.conversation_id == activeConversation.conversation_id ? "user selectUser" : "user"}
    >
      <div className="history-cont">
        {conversation.conversation_type === "group" ? (
          <div>{<Avatar>G</Avatar>}</div>
        ) : (
          <div>{<Avatar src={conversation.participants[0].avatar_url} />}</div>
        )}
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


