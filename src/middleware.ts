import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("token")?.value;
    const isPrivateRoute =
      request.nextUrl.pathname.startsWith("/user") ||
      request.nextUrl.pathname.startsWith("/admin");

      //if  token is not present and route is privatee, redirect to login
    if(!accessToken &&isPrivateRoute){
        return NextResponse.redirect(new URL('/login', request.url))
        
    }

      //if token is present and the routte is login redirect to dashnoard
      if(accessToken && !isPrivateRoute){
        const role  = request.cookies.get("role")?.value;
        const  redirectUrl  = role === 'admin'? "/admin/dashboard" : "/user/dashboard";
         return NextResponse.redirect(new URL(redirectUrl, request.url))
      }



  } catch (error) {
    console.error("middleware errro:", error);
     return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
