import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const adminEmails = [
  "movers.and.packers.uae91@gmail.com",
  "itsmashal2006@gmail.com",
];

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      if (user.email && adminEmails.includes(user.email)) {
        return true;
      }
      return `/login?error=You are not authorized to access this application.`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
