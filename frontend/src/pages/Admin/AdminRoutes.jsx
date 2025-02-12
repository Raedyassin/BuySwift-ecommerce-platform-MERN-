import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
export default function AdminRoutes() {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
