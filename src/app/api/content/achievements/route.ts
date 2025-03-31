import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AchievementItem } from "@/lib/types";

// Define an interface for the raw achievement data
interface RawAchievement {
  title: string;
  organization: string;
  year: string;
  description: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/content/achievements.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the JSON and extract the achievements arrays
    let data: AchievementItem[] = [];
    try {
      const jsonData = JSON.parse(fileContents);
      console.log("Raw achievements data:", jsonData);

      // Extract awards
      if (jsonData && jsonData.awards && Array.isArray(jsonData.awards)) {
        const awardItems = jsonData.awards.map((item: RawAchievement) => ({
          ...item,
          category: "Award",
        }));
        data = [...data, ...awardItems];
      }

      // Extract honors
      if (jsonData && jsonData.honors && Array.isArray(jsonData.honors)) {
        const honorItems = jsonData.honors.map((item: RawAchievement) => ({
          ...item,
          category: "Honor",
        }));
        data = [...data, ...honorItems];
      }

      // Sort by year (descending)
      data.sort((a, b) => {
        const yearA = parseInt(a.year);
        const yearB = parseInt(b.year);
        return yearB - yearA;
      });
    } catch (parseError) {
      console.error("Error parsing achievements JSON:", parseError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading achievements data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch achievements data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
