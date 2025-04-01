import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ProfileData } from "@/lib/types";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/content/profile.json");
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the JSON and ensure it's in the expected format
    let data: ProfileData;
    try {
      const jsonData = JSON.parse(fileContents);
      console.log("Raw profile data:", jsonData);

      // Ensure the data has the required structure
      data = {
        name: jsonData.name || "Portfolio Owner",
        credentials: jsonData.credentials,
        title: jsonData.title || "Professional",
        email: jsonData.email || "contact@example.com",
        bio: jsonData.bio || "Welcome to my portfolio.",
        shortBio: jsonData.shortBio || "Portfolio owner.",
        image: jsonData.image || "/placeholder-profile.jpg",
        social: jsonData.social || {
          twitter: "",
          github: "",
          linkedin: "",
          googleScholar: "",
        },
        skills: Array.isArray(jsonData.skills) ? jsonData.skills : [],
        interests: Array.isArray(jsonData.interests) ? jsonData.interests : [],
      };
    } catch (parseError) {
      console.error("Error parsing profile JSON:", parseError);
      // Provide default data if parsing fails
      data = {
        name: "Portfolio Owner",
        title: "Professional",
        email: "contact@example.com",
        bio: "Welcome to my portfolio.",
        shortBio: "Portfolio owner.",
        image: "/placeholder-profile.jpg",
        social: {
          twitter: "",
          github: "",
          linkedin: "",
          googleScholar: "",
        },
        skills: [],
        interests: [],
      };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading profile data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch profile data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
