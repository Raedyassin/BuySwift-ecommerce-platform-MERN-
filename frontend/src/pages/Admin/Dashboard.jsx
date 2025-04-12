import { useEffect } from "react";
import AdminMenu from "./AdminMenu";

export default function Dashboard() {
    useEffect(() => {
      window.document.title = "Dashboard";
    },[])
  
  return (
    <div>
      <AdminMenu/>
      <div>Dashboard</div>
    </div>
  );
}
