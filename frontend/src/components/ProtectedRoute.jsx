import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/login?redirectTo=${location.pathname}${location.search}`}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
