import { Navigate, Outlet, useLocation } from "react-router";

import useAuthStore from "@/store/auth";

export default function AuthRouter() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={"/login"} />;
  }

  return <Outlet />;
}
