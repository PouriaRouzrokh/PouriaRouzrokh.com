import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ExperienceItem } from "@/lib/types";

// Define an interface for the raw position data
interface RawPosition {
  title: string;
  organization: string;
  location?: string;
  years: string;
  description: string;
  logo?: string;
  technologies?: string[];
  [key: string]: unknown; // For any other properties
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/content/experience.json");
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the JSON and extract the positions array
    let data: ExperienceItem[] = [];
    try {
      const jsonData = JSON.parse(fileContents);
      console.log("Raw experience data:", jsonData);

      // Check if the data has a positions array and use it
      if (jsonData && jsonData.positions && Array.isArray(jsonData.positions)) {
        // Map the positions data to match the expected ExperienceItem format
        data = jsonData.positions.map((position: RawPosition) => {
          return {
            role: position.title,
            organization: position.organization,
            years: position.years,
            description: position.description,
            logoUrl: position.logo,
          };
        });
      } else {
        console.error(
          "Experience data doesn't have a 'positions' array:",
          jsonData
        );
      }
    } catch (parseError) {
      console.error("Error parsing experience JSON:", parseError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading experience data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch experience data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
