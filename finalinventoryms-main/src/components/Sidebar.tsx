
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
  
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-purple-500">InventoryVista</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 rounded-md text-sm group ${
                    isActive
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">
                    <item.icon
                      size={18}
                      className={isActive ? "text-purple-600" : "text-gray-500"}
                    />
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
