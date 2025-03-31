import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { EducationItem } from "@/lib/types";

// Define an interface for the raw degree data
interface RawDegree {
  degree: string;
  institution: string;
  location?: string;
  years: string;
  description: string;
  achievements?: string[];
  logo?: string;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/content/education.json");
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the JSON and extract the degrees array
    let data: EducationItem[] = [];
    try {
      const jsonData = JSON.parse(fileContents);
      console.log("Raw education data:", jsonData);

      // Check if the data has a degrees array and use it
      if (jsonData && jsonData.degrees && Array.isArray(jsonData.degrees)) {
        // Map the degrees data to match the expected EducationItem format
        data = jsonData.degrees.map((item: RawDegree) => ({
          degree: item.degree,
          institution: item.institution,
          years: item.years,
          description: item.description,
          logoUrl: item.logo || undefined,
        }));
      } else {
        console.error(
          "Education data doesn't have a 'degrees' array:",
          jsonData
        );
      }
    } catch (parseError) {
      console.error("Error parsing education JSON:", parseError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading education data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch education data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
