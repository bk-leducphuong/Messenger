import "../src/assets/styles/app/App.css";
import { AllRoutes } from "./routes/AllRoutes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/auth/action";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(checkAuth()); 
  }, []);

  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
