import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        try {
          const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              otp: credentials.otp,
            }),
          });

          const json = await res.json();

          if (!res.ok || !json.success) {
            throw new Error(json.error?.message || json.message || "Invalid credentials");
          }

          if (json.data?.requiresOtp) {
            throw new Error("OTP_REQUIRED");
          }

          const user = json.data;

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split("@")[0],
            role: user.role || "CUSTOMER",
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            avatar: user.avatar,
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.avatar = user.avatar;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
        return token;
      }

      // Return current token if access token has not expired yet
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // If token expired and refreshToken is available, refresh it
      if (token.refreshToken) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });
          const json = await res.json();
          if (res.ok && json.success && json.data) {
            return {
              ...token,
              accessToken: json.data.accessToken,
              refreshToken: json.data.refreshToken || token.refreshToken,
              accessTokenExpires: Date.now() + 14 * 60 * 1000,
              error: undefined,
            };
          }
        } catch (e) {
          // Token refresh failed
        }
      }

      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string | undefined;
        session.user.avatar = token.avatar as string | null;
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "unseen-gadget-nextauth-secret-key-32-chars-long",
};
