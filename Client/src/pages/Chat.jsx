import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Avatar, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeSearchApi } from "../redux/searching/action";
import { accessChat, makeRecentChatApi } from "../redux/recentChat/action";
import { selectChat } from "../redux/chatting/action";
import { SearchComp } from "../components/SearchComp";
import { NotificationComp } from "../components/NotificationComp";

export const MyChat = () => {
  const [search, setSearch] = useState(false);
  const { search_result, loading, error } = useSelector(
    (store) => store.search
  );
  const { recent_chat, loading: chat_loading } = useSelector( // recent_chat = {id, }
    (store) => store.recentChat
  );
  const { user } = useSelector((store) => store.user); // user = {id, name, email}
  const { chatting } = useSelector((store) => store.chatting);
  const { notification, unseenmsg } = useSelector(
    (store) => store.notification
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(makeRecentChatApi());
  }, [user]);

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
            : !chat_loading &&
              recent_chat.map((el, index) => (
                <ChatUserComp
                  key={el.id}
                  {...el}
                  index={index}
                  chattingwith={chatting.id}
                  id={user.id}
                />
              ))}
        </div>
      </div>
    </div>
  );
};


const ChatUserComp = ({
  isGroupChat,
  chatName,
  users,
  latestMessage,
  id,
  index,
  chattingwith,
}) => {
  const dispatch = useDispatch();
  const handleSelectChat = () => {
    dispatch(
      selectChat({
        isGroupChat,
        index,
        user: users.find((el) => el.id != id),
        id,
        chatName,
      })
    );
  };
  return (
    <div
      onClick={handleSelectChat}
      className={chattingwith == id ? "user selectUser" : "user"}
    >
      <div className="history-cont">
        {isGroupChat ? (
          <div>{<Avatar>G</Avatar>}</div>
        ) : (
          <div>{<Avatar src={users.find((el) => el.id != id)?.pic} />}</div>
        )}
        <div>
          {isGroupChat ? (
            <p className="name">{chatName}</p>
          ) : (
            <p className="name">{users.find((el) => el.id != id)?.name}</p>
          )}
          {/* <p className="chat">
            {latestMessage
              ? latestMessage.content.length > 8
                ? latestMessage.content.substring(0, 30) + " . . ."
                : latestMessage.content
              : ""}
          </p> */}
        </div>
      </div>
      <div>
        {latestMessage ? (
          <p className="time">
            {new Date(latestMessage?.updatedAt).getHours() +
              ":" +
              new Date(latestMessage?.updatedAt).getMinutes()}
          </p>
        ) : (
          ""
        )}
        {/* <p className="unseen-chat">5</p> */}
      </div>
    </div>
  );
};


