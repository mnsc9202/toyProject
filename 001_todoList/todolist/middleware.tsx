import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외
     * - todo (메인 페이지)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|todo).*)",
    },
  ],
};

export function middleware(request: NextRequest) {
  const url: NextURL = request.nextUrl.clone(); // 요청 url

  // todo 페이지로 이동
  return NextResponse.redirect(new URL("/todo", request.url));
}
