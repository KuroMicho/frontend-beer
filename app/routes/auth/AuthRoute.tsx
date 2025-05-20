import { Navigate, Outlet } from "react-router";
import { getAccessToken } from "../../lib/auth";
import { useLocation } from "react-router";

export default function AuthRoute() {
  const token = getAccessToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
