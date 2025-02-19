import { Route, Routes } from "react-router-dom";
import { LoginComp } from "../pages/Login";
import { RegisterComp } from "../pages/Register";
import { HomeComp } from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import RouteErrorBoundary from "../components/RouteErrorBoundary";
import NotFound from "../pages/NotFound";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeComp />
            </ProtectedRoute>
          }
          errorElement={<RouteErrorBoundary />}
        ></Route>
        <Route path="/register" element={<RegisterComp />} errorElement={<RouteErrorBoundary />}></Route>
        <Route path="/login" element={<LoginComp />} errorElement={<RouteErrorBoundary />}></Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </>
  );
};
