import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { House, Settings, SquarePlus, Target, UserPen } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", label: "Home", icon: <House />,end:true},
    { path: "/dashboard/profile", label: "Profile", icon: <UserPen /> },
    { path: "/dashboard/settings", label: "Settings", icon: <Settings /> },
    { path: "/dashboard/products", label: "Products", icon: <Target /> },
    {
      path: "/dashboard/addproduct",
      label: "Add-Products",
      icon: <SquarePlus />,
    },
    {
      path: "/dashboard/addstudent",
      label: "Add-Student",
      icon: <SquarePlus />,
    },
    { path: "/dashboard/todo", label: "To-do", icon: <SquarePlus /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Dashboard</h3>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
