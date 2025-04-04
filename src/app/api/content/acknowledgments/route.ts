import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AcknowledgmentItem } from "@/lib/types";

// Define an interface for the raw acknowledgment data
interface RawAcknowledgment {
  name: string;
  credentials: string;
  years: string;
  title: string;
  affiliation: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/content/acknowledgments.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the JSON and extract the mentors array
    let data: AcknowledgmentItem[] = [];
    try {
      const jsonData = JSON.parse(fileContents);
      console.log("Raw acknowledgments data:", jsonData);

      // Extract mentors
      if (jsonData && jsonData.mentors && Array.isArray(jsonData.mentors)) {
        data = jsonData.mentors.map((item: RawAcknowledgment) => ({
          name: item.name,
          credentials: item.credentials,
          years: item.years,
          title: item.title,
          affiliation: item.affiliation,
          imageUrl: item.imageUrl,
        }));
      }
    } catch (parseError) {
      console.error("Error parsing acknowledgments JSON:", parseError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading acknowledgments data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch acknowledgments data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
