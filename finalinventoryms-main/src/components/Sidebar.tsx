import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package2,
  PackageOpen,
  FolderTree,
  Users,
  PackageCheck,
  UserCircle,
  Warehouse,
  Settings,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package2 },
  { name: "Inventory", path: "/inventory", icon: PackageOpen },
  { name: "Categories", path: "/categories", icon: FolderTree },
  { name: "Suppliers", path: "/suppliers", icon: Users },
  { name: "Orders", path: "/orders", icon: PackageCheck },
  { name: "Customers", path: "/customers", icon: User },
  { name: "Employees", path: "/employees", icon: UserCircle },
  { name: "Warehouses", path: "/warehouses", icon: Warehouse },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className={`text-xl font-semibold text-purple-500 transition-all duration-200 ${collapsed ? "text-base" : ""}`}>
          {collapsed ? "IV" : "InventoryVista"}
        </h1>
        <button
          className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 rounded-md text-sm group transition-all duration-200 ${
                    isActive
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <span className="mr-3 flex-shrink-0">
                    <item.icon
                      size={18}
                      className={isActive ? "text-purple-600" : "text-gray-500"}
                    />
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
