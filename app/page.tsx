import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/Signin");
  }

  // This return statement will never be reached, but is needed to satisfy TypeScript
  return null;
}
