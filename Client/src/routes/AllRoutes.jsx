import { Route, Routes } from "react-router-dom";
import { LoginComp } from "../pages/Login";
import { RegisterComp } from "../pages/Register";
import { HomeComp } from "../pages/Home";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeComp />}></Route>
        <Route path="/register" element={<RegisterComp />}></Route>
        <Route path="/login" element={<LoginComp />}></Route>
      </Routes>
    </>
  );
};
