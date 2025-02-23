import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "../src/assets/styles/app/App.css";
import { AllRoutes } from "./routes/AllRoutes";
import { checkAuth } from "./redux/auth/action";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
