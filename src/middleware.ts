import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  // Skip middleware entirely if Supabase isn't configured yet
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - / (landing page)
     * - /api/health
     * - /api/stripe-webhook
     * - static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|images|stickers|api/health|api/stripe-webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
