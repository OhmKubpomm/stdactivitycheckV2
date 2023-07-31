
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
    function middleware(req){
        const {pathname,origin} =req.nextUrl;
        const {token} =req.nextauth;
        if(pathname.startsWith('/dashboard') && token?.user?.role !== 'admin'){
            return new NextResponse('You are not Authorized')
        }
    },
    {
        callbacks:{
            authorized:({token})=>{
                return !!token;
    },
},
    }
)
export const config = {
    matcher: ["/profile/:path*", "/protected/:path*", "/dashboard/:path*"]
}
    



