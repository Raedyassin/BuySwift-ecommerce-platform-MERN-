import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logOut } from "../../redux/features/auth/authSlice";
export default function AdminRoutes() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (
      !userInfo ||
      [null, undefined, ""].includes(
        JSON.parse(localStorage.getItem("expirationTokenDate"))
      ) ||
      Date.now() >= new Date(JSON.parse(localStorage.getItem("expirationTokenDate")))
    ) {
      // i don't need call logout api because the token is invalid now
      dispatch(logOut());
    }
  }, [dispatch, userInfo]);

  return userInfo?.isAdmin &&
    ![null, undefined, ""].includes(
      JSON.parse(localStorage.getItem("expirationTokenDate"))
    ) &&
    Date.now() <
      new Date(JSON.parse(localStorage.getItem("expirationTokenDate"))) ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${location.pathname}`} replace />
  );
}
