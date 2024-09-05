import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDatabase from "@/utils/connectdatabase";
import User from "@/models/Usermodel";
import bcrypt from "bcryptjs";

connectDatabase();

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const typedCredentials = credentials as {
          email: string;
          password: string;
        };
        return await signInwithCredentials(typedCredentials);
      },
    }),
  ],
  pages: {
    signIn: "/Signin",
    error: "/errors",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.type === "oauth") {
        return await signInWith0Auth({ account, profile });
      }
      return true;
    },
    async jwt({ token }) {
      const user = await getUserByEmail(token.email || "");
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};
const nextAuthHandlers = NextAuth(authOptions);

export const { handlers, auth, signIn, signOut } = nextAuthHandlers;

async function signInWith0Auth({
  account,
  profile,
}: {
  account: any;
  profile: any;
}) {
  const user = await User.findOne({ email: profile.email });
  if (user) return true;

  const newUser = new User({
    name: profile.name,
    email: profile.email,
    image: profile.picture,
    provider: account.provider,
  });
  await newUser.save();
  return true;
}

async function getUserByEmail(email: string) {
  const user = await User.findOne({ email }).select("-password");
  if (!user) return null;
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
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { ...user._doc, _id: user._id.toString() };
}
