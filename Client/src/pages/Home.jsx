import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ChattingPage } from "../components/ChattingPage";
import { MyChat } from "./Chat";
import {SideNavbar} from "../components/SideNavbar";

export const HomeComp = () => {
  const { user, loading, error } = useSelector((store) => store.user);
  const { activeConversation } = useSelector((store) => store.conversation);

  return (
    <div className="home-cont">
      <SideNavbar />
      <MyChat />
      {activeConversation.conversation_id ? <ChattingPage /> : <MessageStarter {...user} />}
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
