import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">My <span className="text-red-600">Account</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center shadow-sm">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
            {session.user?.name?.[0] || "U"}
          </div>
          <h2 className="text-gray-900 dark:text-white font-bold text-lg">{session.user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{session.user?.email}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            (session.user as any)?.role === "admin" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}>
            {(session.user as any)?.role === "admin" ? "Administrator" : "Member"}
          </span>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { icon: "🛒", title: "My Orders", desc: "View order history", href: "#" },
            { icon: "❤️", title: "Wishlist", desc: "Saved items", href: "#" },
            { icon: "📍", title: "Addresses", desc: "Manage addresses", href: "#" },
            { icon: "🔒", title: "Security", desc: "Password & security", href: "#" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 rounded-xl p-4 transition-all group shadow-sm">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-gray-900 dark:text-white font-semibold text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{item.title}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>
      {(session.user as any)?.role === "admin" && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-400 font-medium mb-2">Administrator Access</p>
          <Link href="/admin" className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Go to Admin Dashboard →</Link>
        </div>
      )}
    </div>
  );
}
