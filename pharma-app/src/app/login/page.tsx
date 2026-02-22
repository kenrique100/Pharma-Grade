"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({ email, password, callbackURL: "/" });
      if (result?.error) {
        setError(result.error.message ?? "Invalid email or password");
        setLoading(false);
      } else {
        toast.success("Login successful! Welcome back.");
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast("Google sign-in requires OAuth configuration.", { icon: "ℹ️" });
    await signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Image src="/images/logo.webp" alt="Pharma Grade" width={48} height={48} className="rounded-xl" />
          </Link>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <span className="text-red-600 font-black text-3xl">PHARMA</span>
            <span className="text-gray-900 dark:text-white font-black text-3xl">GRADE</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-gray-900 px-2 text-gray-400">or sign in with email</span></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 rounded-lg transition-colors">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Don&apos;t have an account?{" "}
              <Link href="/register" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">Register here</Link>
            </p>
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-400">
            <p className="font-medium text-gray-500 dark:text-gray-400 mb-1">Demo credentials:</p>
            <p>Admin: admin@pharmagrade.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
