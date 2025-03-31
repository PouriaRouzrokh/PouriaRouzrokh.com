import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ProjectItem } from "@/lib/types";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/content/projects.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents) as ProjectItem[];

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading projects data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch projects data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
