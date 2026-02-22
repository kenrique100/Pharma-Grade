"use client";

import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AccountPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  const user = session.user;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        await authClient.updateUser({ image: dataUrl });
        toast.success("Profile picture updated!");
        await refetch();
      } catch (err) {
        console.error("Failed to update profile picture:", err);
        toast.error("Failed to update profile picture");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async () => {
    if (!confirm("Remove your profile picture?")) return;
    setUploading(true);
    try {
      await authClient.updateUser({ image: "" });
      toast.success("Profile picture removed!");
      await refetch();
    } catch (err) {
      console.error("Failed to remove profile picture:", err);
      toast.error("Failed to remove profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">My <span className="text-red-600">Account</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center shadow-sm">
          <div className="relative w-20 h-20 mx-auto mb-3">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name || "Profile"} className="w-20 h-20 rounded-full object-cover border-2 border-red-600" />
            ) : (
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
                {user?.name?.[0] || "U"}
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {uploading ? "Saving..." : user?.image ? "Change Photo" : "Upload Photo"}
            </button>
            {user?.image && (
              <button
                onClick={handleDeleteImage}
                disabled={uploading}
                className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <h2 className="text-gray-900 dark:text-white font-bold text-lg">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            user?.role === "admin" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}>
            {user?.role === "admin" ? "Administrator" : "Member"}
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
      {user?.role === "admin" && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-400 font-medium mb-2">Administrator Access</p>
          <Link href="/admin" className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Go to Admin Dashboard →</Link>
        </div>
      )}
    </div>
  );
}
