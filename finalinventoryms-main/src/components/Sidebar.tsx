import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: "🏠", label: "Dashboard", path: "/" },
  { icon: "📦", label: "Products", path: "/products" },
  { icon: "📦", label: "Inventory", path: "/inventory" },
  { icon: "📂", label: "Categories", path: "/categories" },
  { icon: "🚚", label: "Suppliers", path: "/suppliers" },
  { icon: "🧾", label: "Orders", path: "/orders" },
  { icon: "👥", label: "Customers", path: "/customers" },
  { icon: "👤", label: "Employees", path: "/employees" },
  { icon: "🏢", label: "Warehouses", path: "/warehouses" },
  { icon: "📊", label: "Reports", path: "/reports" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  // Sidebar styles
  const sidebarStyle: React.CSSProperties = {
    width: collapsed ? 60 : 220,
    transition: "width 0.2s",
    background: "#fff",
    borderRight: "1px solid #eee",
    minHeight: "100vh",
    position: isMobile ? "fixed" : "relative",
    left: isMobile && !mobileOpen ? -220 : 0,
    top: 0,
    zIndex: 200,
    boxShadow: isMobile && mobileOpen ? "2px 0 8px rgba(0,0,0,0.15)" : undefined,
    transitionProperty: "width, left",
    transitionDuration: "0.2s, 0.3s",
  };

  return (
    <>
      {/* Hamburger for mobile */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 300,
          }}
          aria-label="Open sidebar"
        >
          <FaBars />
        </button>
      )}
      <div style={sidebarStyle}>
        {/* Collapse/Expand button */}
        <button
          onClick={() => {
            if (isMobile) setMobileOpen(false);
            else setCollapsed((prev) => !prev);
          }}
          style={{
            position: "absolute",
            top: 16,
            right: -24,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
          aria-label={isMobile ? "Close sidebar" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>
        <div style={{ padding: "24px 12px" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#9f5cff",
              marginBottom: 32,
              textAlign: collapsed ? "center" : "left",
              transition: "opacity 0.2s",
              opacity: collapsed ? 0 : 1,
              height: 28,
              overflow: "hidden",
            }}
          >
            {!collapsed && "InventoryVista"}
          </div>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {menuItems.map((item) => (
                <li
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 24,
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  <NavLink
                    to={item.path}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: isActive ? "#9f5cff" : "inherit",
                      fontWeight: isActive ? 700 : 400,
                      width: "100%",
                    })}
                  >
                    <span style={{ marginRight: collapsed ? 0 : 12, fontSize: 20 }}>
                      {item.icon}
                    </span>
                    <span
                      style={{
                        transition: "opacity 0.2s, width 0.2s",
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : "auto",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {!collapsed && item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            zIndex: 150,
          }}
        />
      )}
    </>
  );
};

export default Sidebar;