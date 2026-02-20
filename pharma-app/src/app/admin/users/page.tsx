const users = [
  { id: "1", name: "Admin User", email: "admin@pharmagrade.com", role: "admin", orders: 0, joined: "2024-01-01" },
  { id: "2", name: "Test User", email: "user@pharmagrade.com", role: "user", orders: 3, joined: "2024-01-05" },
  { id: "3", name: "John Doe", email: "john@example.com", role: "user", orders: 7, joined: "2024-01-08" },
  { id: "4", name: "Jane Smith", email: "jane@example.com", role: "user", orders: 2, joined: "2024-01-10" },
  { id: "5", name: "Mike Johnson", email: "mike@example.com", role: "user", orders: 12, joined: "2024-01-12" },
];

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Manage <span className="text-red-600">Users</span></h1>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Orders</th>
                <th className="text-left p-4">Joined</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700/50 text-sm">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{user.name[0]}</div>
                      <span className="text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-red-900 text-red-400" : "bg-gray-700 text-gray-400"}`}>{user.role}</span>
                  </td>
                  <td className="p-4 text-gray-300">{user.orders}</td>
                  <td className="p-4 text-gray-400">{user.joined}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">View</button>
                      <button className="text-red-400 hover:text-red-300 text-xs font-medium">Delete</button>
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
