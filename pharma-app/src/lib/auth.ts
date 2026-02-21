import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// Pre-computed hashes (demo only — use a database in production)
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@pharmagrade.com",
    password: "$2b$10$2bhk5pvPw33W94YktS6jBuBTTi5.4JC/E8AAlJzmaSML9JYG7llGa", // admin123
    role: "admin",
  },
];

const providers = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const user = users.find((u) => u.email === credentials?.email);
      if (!user) return null;
      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      );
      if (!isValid) return null;
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },
  }),
];

// Add Google provider only when credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }) as any
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role ?? "user";
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
