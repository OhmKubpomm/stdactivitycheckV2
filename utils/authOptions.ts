import GoogleProvider from "next-auth/providers/google";
import connectDatabase from "@/utils/connectdatabase";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/Usermodel";
import bcrypt from "bcrypt";

import type { NextAuthOptions } from "next-auth";

connectDatabase();

export const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "email", require: true },
        password: { label: "Password", type: "password", require: true },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials ?? { email: "", password: "" };
        const user = await signInwithCredentials({ email, password });
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/Signin", // go to /api/auth/signin
    error: "/errors", // go to /api/auth/error
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account && account.type === "oauth") {
        return await signInWith0Auth({ account, profile });
      }

      return true;
    },

    async jwt({ token, trigger, session }) {
      const user = await getUserByEmail({ email: token.email || "" });

      token.user = user as
        | {
            _id?: string | null | undefined;
            name?: string | null | undefined;
            email?: string | null | undefined;
            image?: string | null | undefined;
          }
        | undefined;
      return token;
    },
    async session({ session, token }) {
      // ตรวจสอบว่า token.user ไม่เป็น undefined ก่อนที่จะ assign ค่าให้ session.user
      if (token.user) {
        session.user = {
          ...token.user,
        };
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

/* ------------------------------------ */
async function signInWith0Auth({
  account,
  profile,
}: {
  account: any;
  profile: any;
}) {
  const user = await User.findOne({ email: profile.email });
  if (user) return true; // sign in

  const newUser = new User({
    name: profile.name,
    email: profile.email,
    image: profile.picture,
    provider: account.provider,
  });
  await newUser.save();
  return true;
}

async function getUserByEmail({ email }: { email: string }) {
  const user = await User.findOne({ email }).select("-password");
  if (!user) throw new Error("Email not found");
  return { ...user._doc, _id: user._id.toString() };
}
async function signInwithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email not found");

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) throw new Error("Password not match");
  return { ...user._doc, _id: user._id.toString() };
}
