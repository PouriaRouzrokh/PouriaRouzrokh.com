import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PortfolioItem } from "@/lib/types";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/content/portfolio.json");
    const fileContents = fs.readFileSync(filePath, "utf8");

    let data: PortfolioItem[] = [];
    try {
      data = JSON.parse(fileContents);
      console.log("Portfolio data from file:", data);
    } catch (parseError) {
      console.error("Error parsing portfolio JSON:", parseError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch portfolio data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
