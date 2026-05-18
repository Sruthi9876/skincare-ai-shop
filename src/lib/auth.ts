import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) return null;

        // IMPORTANT: Return the ID here so it can be put into the JWT token
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // 1. This runs when the JWT token is created/updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add the MongoDB ID to the token
        token.role = (user as any).role;
      }
      return token;
    },
    // 2. This runs whenever the session is checked (the data sent to the browser)
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id; // Pass the ID from the token to the session
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "lumina-skin-secret-key",
  session: { strategy: "jwt" },
};