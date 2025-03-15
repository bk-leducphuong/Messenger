import "../assets/styles/search/search.css";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { accessChat } from "../redux/recentChat/action";

// Add new SearchUserComp for displaying user search results
export const SearchUserComp = ({ user, setSearch }) => {
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