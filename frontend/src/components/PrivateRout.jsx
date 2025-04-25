import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logOut } from "../redux/features/auth/authSlice";
export default function PrivateRout() {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      [null, undefined, ""].includes(
        JSON.parse(localStorage.getItem("expirationTokenDate"))
      ) ||
      Date.now() >=
        new Date(JSON.parse(localStorage.getItem("expirationTokenDate")))
    ) {
      // i don't need call logout api because the token is invalid now
      dispatch(logOut());
    }
  }, [dispatch]);

  return userInfo &&
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
