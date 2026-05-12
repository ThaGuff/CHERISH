import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    app: "cherish",
    timestamp: new Date().toISOString(),
  });
}
