import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

const handler = NextAuth({
  providers,
  callbacks: {
    async signIn({ user }) {
      try {
        await connectToDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            username: user.name,
            email: user.email,
            password: "", // empty since social users don’t use password
          });
        }

        return true;
      } catch (err) {
        console.log("❌ Social login error:", err);
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
