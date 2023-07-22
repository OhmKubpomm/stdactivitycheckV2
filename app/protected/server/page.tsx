'use server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth"

const Protectpageserver = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>Protectpageserver
      <p>{session?.user?.name}</p>
    </div>
  )
}
export default Protectpageserver