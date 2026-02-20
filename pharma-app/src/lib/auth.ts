import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
  {
    id: "2",
    name: "Test User",
    email: "user@pharmagrade.com",
    password: "$2b$10$aKKJLWifABKYn8lNFE8GX.AGIpJmi2nVWAJRVWTmiUROY8MObyaM2", // user123
    role: "user",
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
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
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
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
