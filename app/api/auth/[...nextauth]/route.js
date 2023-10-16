import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDatabase from "@/utils/connectdatabase";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/Usermodel";
import bcrypt from "bcrypt";

connectDatabase();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "email", require: true },
        password: { label: "Password", type: "password", require: true },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
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
      if (account.type === "oauth") {
        return await signInWith0Auth({ account, profile });
      }

      return true;
    },

    async jwt({ token, trigger, session }) {
      const user = await getUserByEmail({ email: token.email });

      token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/* ------------------------------------ */
async function signInWith0Auth({ account, profile }) {
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

async function getUserByEmail({ email }) {
  const user = await User.findOne({ email }).select("-password");
  if (!user) throw new Error("Email not found");
  return { ...user._doc, _id: user._id.toString() };
}
async function signInwithCredentials({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email not found");

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) throw new Error("Password not match");
  return { ...user._doc, _id: user._id.toString() };
}
