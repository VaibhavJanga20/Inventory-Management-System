
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Package2, PackageCheck, Users } from "lucide-react";

const categoryData = [
  { name: "Electronics", count: 140 },
  { name: "Furniture", count: 95 },
  { name: "Clothing", count: 100 },
  { name: "Books", count: 75 },
  { name: "Kitchen", count: 85 },
  { name: "Sports", count: 60 },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Smith", date: "2025-05-01", amount: "$350.00", status: "delivered" },
  { id: "ORD-002", customer: "Emily Johnson", date: "2025-04-30", amount: "$125.50", status: "shipped" },
  { id: "ORD-003", customer: "Michael Brown", date: "2025-04-29", amount: "$780.00", status: "processing" },
  { id: "ORD-004", customer: "Sarah Williams", date: "2025-04-28", amount: "$92.75", status: "delivered" },
  { id: "ORD-005", customer: "David Miller", date: "2025-04-27", amount: "$215.25", status: "processing" },
];

const lowStockItems = [
  { product: "Wireless Headphones", category: "Electronics", current: 5, min: 10 },
  { product: "Office Chair", category: "Furniture", current: 3, min: 8 },
  { product: "Cotton T-shirt", category: "Clothing", current: 7, min: 15 },
  { product: "Stainless Steel Water Bottle", category: "Kitchen", current: 4, min: 12 },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-gray-600 text-sm mb-6">Welcome to your inventory management system</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Products Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
              <p className="text-2xl font-semibold mt-1">1,284</p>
              <p className="text-xs text-green-600 mt-1">+4.75% from last month</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Package2 size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        {/* Active Orders Card */}
        <div className="bg-purple-500 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-white/90">Active Orders</h2>
              <p className="text-2xl font-semibold mt-1 text-white">64</p>
              <p className="text-xs text-purple-200 mt-1">+12.40% from last week</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <PackageCheck size={20} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Total Suppliers Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Suppliers</h2>
              <p className="text-2xl font-semibold mt-1">28</p>
              <p className="text-xs text-gray-500 mt-1">No change from last month</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Inventory by Category Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-2">Inventory by Category</h2>
          <p className="text-sm text-gray-500 mb-4">Breakdown of products in each category</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" scale="point" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Low Stock Alert</h2>
              <p className="text-sm text-gray-500">Items that need to be restocked soon</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2 text-right">Current</th>
                  <th className="px-4 py-2 text-right">Min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm">{item.product}</td>
                    <td className="px-4 py-3 text-sm">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.current}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-2">Recent Orders</h2>
        <p className="text-sm text-gray-500 mb-4">Latest customer orders</p>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.customer}</td>
                  <td className="px-4 py-3 text-sm">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-right">{order.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

