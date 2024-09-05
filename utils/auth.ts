import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDatabase from "@/utils/connectdatabase";
import User from "@/models/Usermodel";
import bcrypt from "bcryptjs";

// Connect to the database
connectDatabase();

// Define NextAuth configuration
export const { handlers, auth, signIn, signOut } = NextAuth({
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
        // Cast credentials to the correct type
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          return null;
        }
        return await signInWithCredentials({ email, password });
      },
    }),
  ],
  pages: {
    signIn: "/Signin",
    error: "/errors",
  },
  callbacks: {
    async signIn({ account, profile }: { account: any; profile: any }) {
      if (account?.type === "oauth") {
        return await signInWithOAuth({ account, profile });
      }
      return true;
    },
    async jwt({ token }: { token: any; user?: any }) {
      const user = await getUserByEmail(token.email || "");
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});

// Helper function for OAuth sign in
async function signInWithOAuth({
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

// Helper function to find user by email
async function getUserByEmail(email: string) {
  const user = await User.findOne({ email }).select("-password");
  if (!user) return null;
  return { ...user._doc, _id: user._id.toString() };
}

// Helper function for Credentials sign in
async function signInWithCredentials({
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
