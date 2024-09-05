import { auth } from "@/auth";

export default auth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    if (pathname.startsWith("/dashboard") && !token) {
      return { Error };
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);
export const config = {
  matcher: ["/profile/:path*", "/protected/:path*", "/submit/:path*"],
};
