import { NextRequest, NextResponse } from "next/server";
import { CONVEX_URL } from "../../components/agents/lib/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, args } = body;

    if (!CONVEX_URL) {
      return NextResponse.json({ error: "CONVEX_URL not configured" }, { status: 500 });
    }

    const response = await fetch(`${CONVEX_URL}/api/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Convex error: ${response.status} - ${error}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
