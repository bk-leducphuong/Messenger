import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
// import { ChattingPage } from "../components/ChattingPage";
import { MyChat } from "./Chat";
import {SideNavbar} from "../components/SideNavbar";

export const HomeComp = () => {
  const { user, loading, error } = useSelector((store) => store.user);
  const { chatting } = useSelector((store) => store.chatting);

  if (!user.id) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-cont">
      <SideNavbar />
      <MyChat />
      {chatting.id ? <ChattingPage /> : <MessageStarter {...user} />}
    </div>
  );
};

const MessageStarter = ({ pic, name }) => {
  return (
    <div className="chattingpage start-msg">
      <div>
        <Avatar src={pic} sx={{ width: 70, height: 70 }} />
        <h3>Welcome, {name}</h3>
        <p>Please select a chat to start messaging.</p>
      </div>
    </div>
  );
};
