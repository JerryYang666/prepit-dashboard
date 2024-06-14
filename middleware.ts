// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const signInPagePath = "/auth/signin";
const dashboardPagePath = "/dashboard";
const basePath = "/";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === basePath) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    // check if refresh token is an uuid
    const isUuid =
      refreshToken &&
      refreshToken.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      );
    const isLoggedin = refreshToken && isUuid;
    if (isLoggedin) {
      // redirect to the dashboard
      const url = request.nextUrl.clone();
      url.pathname = dashboardPagePath;
      return NextResponse.redirect(url);
    } else {
      // redirect to the sign in page
      const url = request.nextUrl.clone();
      url.pathname = signInPagePath;
      return NextResponse.redirect(url);
    }
  }

  if (request.nextUrl.pathname === signInPagePath) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    // check if refresh token is an uuid
    const isUuid =
      refreshToken &&
      refreshToken.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      );
    const isLoggedin = refreshToken && isUuid;
    if (isLoggedin) {
      // redirect to the dashboard
      const url = request.nextUrl.clone();
      url.pathname = dashboardPagePath;
      return NextResponse.redirect(url);
    } else {
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith(dashboardPagePath)) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    // check if refresh token is an uuid
    const isUuid =
      refreshToken &&
      refreshToken.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      );
    const isLoggedin = refreshToken && isUuid;
    if (isLoggedin) {
      return NextResponse.next();
    } else {
      // redirect to the sign in page
      const url = request.nextUrl.clone();
      url.pathname = signInPagePath;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
