import Sidebar from "./sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <main className="layout">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="children">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
