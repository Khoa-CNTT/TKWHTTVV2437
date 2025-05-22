import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  role: string;
  exp: number;
  // có thể thêm các field khác nếu cần
};

export function middleware(request: NextRequest) {
  console.log("Middleware chạy với url:", request.nextUrl.pathname);
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const { role } = decoded;

    const pathname = request.nextUrl.pathname;

    // Role 9 có toàn quyền truy cập
    if (role === "9") {
      return NextResponse.next();
    }

    // Role 7 chỉ được phép vào /homestay, cấm /admin
    if (role === "7") {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Được vào /homestay hoặc các trang khác (ngoài /admin)
      return NextResponse.next();
    }

    // Các role khác (ví dụ 3) không được vào /admin và /homestay
    if (pathname.startsWith("/admin") || pathname.startsWith("/homestay")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Mặc định cho các route không bảo vệ (nếu có)
    return NextResponse.next();
  } catch (error) {
    console.error("Token decode error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: ["/admin/:path*", "/homestay/:path*"],
};
