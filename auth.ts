import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDatabase from "@/utils/connectdatabase";
import User from "@/models/Usermodel";
import bcrypt from "bcryptjs";
import authConfig from "@/auth.config";

// เชื่อมต่อฐานข้อมูล
connectDatabase();

// กำหนดการตั้งค่า NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/Signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            console.error("Missing email or password");
            return null;
          }
          const result = await signInWithCredentials({ email, password });
          if (!result) {
            console.error(`Login failed for email: ${email}`);
          }
          return result;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return await signInWithOAuth({ account, profile });
      }
      return true;
    },
    async jwt({ token }: { token: any }) {
      const user = await getUserByEmail(token.email || "");
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.user) {
        session.user = token.user;
      } else if (session.user?.email) {
        // ถ้าไม่มีข้อมูลใน token ให้ดึงข้อมูลจากฐานข้อมูลอีกครั้ง
        const user = await getUserByEmail(session.user.email);
        if (user) {
          session.user = user;
        }
      }
      return session;
    },
    ...authConfig,
  },
});

// ฟังก์ชันช่วยสำหรับ OAuth sign in
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
    role: "user",
  });
  await newUser.save();
  return true;
}

// ฟังก์ชันช่วยสำหรับการหา user โดย email
async function getUserByEmail(email: string) {
  const user = await User.findOne({ email }).select("-password");
  if (!user) return null;
  return { ...user._doc, _id: user._id.toString() };
}

// ฟังก์ชันช่วยสำหรับการลงชื่อเข้าใช้งานด้วย Credentials
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
