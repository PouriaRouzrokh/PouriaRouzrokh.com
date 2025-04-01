import { NextResponse } from "next/server";
import { getResearch } from "@/lib/data-fetching";

export async function GET() {
  try {
    const research = await getResearch();
    return NextResponse.json(research);
  } catch (error) {
    console.error("Error fetching research data:", error);
    return NextResponse.json(
      { error: "Failed to fetch research data" },
      { status: 500 }
    );
  }
}
