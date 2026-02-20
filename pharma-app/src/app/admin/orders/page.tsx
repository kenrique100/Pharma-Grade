const orders = [
  { id: "#1001", customer: "John Doe", email: "john@example.com", products: ["Testosterone Enanthate 250"], total: "$55", status: "Shipped", date: "2024-01-15" },
  { id: "#1002", customer: "Jane Smith", email: "jane@example.com", products: ["Anavar 10mg"], total: "$85", status: "Processing", date: "2024-01-14" },
  { id: "#1003", customer: "Mike Johnson", email: "mike@example.com", products: ["HGH 100IU"], total: "$180", status: "Delivered", date: "2024-01-13" },
  { id: "#1004", customer: "Sarah Wilson", email: "sarah@example.com", products: ["Nolvadex 20mg", "Clomid 50mg"], total: "$95", status: "Shipped", date: "2024-01-12" },
  { id: "#1005", customer: "Tom Brown", email: "tom@example.com", products: ["Clenbuterol 40mcg"], total: "$40", status: "Processing", date: "2024-01-11" },
  { id: "#1006", customer: "Alice Green", email: "alice@example.com", products: ["Deca 300", "Nolvadex 20mg"], total: "$115", status: "Delivered", date: "2024-01-10" },
];

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Manage <span className="text-red-600">Orders</span></h1>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Products</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700/50 text-sm">
                  <td className="p-4 text-gray-400 font-mono">{order.id}</td>
                  <td className="p-4">
                    <div className="text-white">{order.customer}</div>
                    <div className="text-gray-500 text-xs">{order.email}</div>
                  </td>
                  <td className="p-4 text-gray-300 text-xs">{order.products.join(", ")}</td>
                  <td className="p-4 text-green-400 font-semibold">{order.total}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered" ? "bg-green-900 text-green-400" :
                      order.status === "Shipped" ? "bg-blue-900 text-blue-400" : "bg-yellow-900 text-yellow-400"
                    }`}>{order.status}</span>
                  </td>
                  <td className="p-4 text-gray-400">{order.date}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">View</button>
                      <button className="text-yellow-400 hover:text-yellow-300 text-xs font-medium">Update</button>
                    </div>
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
