import { products } from "@/lib/products";
import Link from "next/link";

const stats = [
  { label: "Total Revenue", value: "$48,250", icon: "💰", change: "+12%" },
  { label: "Total Orders", value: "1,284", icon: "🛒", change: "+8%" },
  { label: "Total Products", value: String(products.length), icon: "📦", change: "0%" },
  { label: "Total Users", value: "892", icon: "👥", change: "+15%" },
];

const recentOrders = [
  { id: "#1001", customer: "John Doe", product: "Testosterone Enanthate 250", amount: "$55", status: "Shipped" },
  { id: "#1002", customer: "Jane Smith", product: "Anavar 10mg", amount: "$85", status: "Processing" },
  { id: "#1003", customer: "Mike Johnson", product: "HGH 100IU", amount: "$180", status: "Delivered" },
  { id: "#1004", customer: "Sarah Wilson", product: "Nolvadex 20mg", amount: "$50", status: "Shipped" },
  { id: "#1005", customer: "Tom Brown", product: "Clenbuterol 40mcg", amount: "$40", status: "Processing" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Admin <span className="text-red-600">Dashboard</span></h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/products" className="bg-red-900/30 border border-red-800 hover:border-red-600 rounded-xl p-4 transition-colors group">
          <div className="text-xl mb-1">📦</div>
          <div className="text-white font-semibold text-sm">Manage Products</div>
          <div className="text-gray-400 text-xs">{products.length} products</div>
        </Link>
        <Link href="/admin/orders" className="bg-blue-900/30 border border-blue-800 hover:border-blue-600 rounded-xl p-4 transition-colors group">
          <div className="text-xl mb-1">🛒</div>
          <div className="text-white font-semibold text-sm">Manage Orders</div>
          <div className="text-gray-400 text-xs">1,284 orders</div>
        </Link>
        <Link href="/admin/users" className="bg-purple-900/30 border border-purple-800 hover:border-purple-600 rounded-xl p-4 transition-colors group">
          <div className="text-xl mb-1">👥</div>
          <div className="text-white font-semibold text-sm">Manage Users</div>
          <div className="text-gray-400 text-xs">892 users</div>
        </Link>
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700/50 text-sm">
                  <td className="p-4 text-gray-400 font-mono">{order.id}</td>
                  <td className="p-4 text-white">{order.customer}</td>
                  <td className="p-4 text-gray-300">{order.product}</td>
                  <td className="p-4 text-green-400 font-semibold">{order.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered" ? "bg-green-900 text-green-400" :
                      order.status === "Shipped" ? "bg-blue-900 text-blue-400" : "bg-yellow-900 text-yellow-400"
                    }`}>{order.status}</span>
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
