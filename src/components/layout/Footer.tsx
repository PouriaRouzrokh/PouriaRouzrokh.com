"use client";

import { useEffect, useState } from "react";
import { SocialLinks } from "@/components/ui/social-links";
import { ProfileData } from "@/lib/types";

export default function Footer() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/content/profile");
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Set fallback data
        setProfileData({
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
            researchGate: "",
            orcid: "",
          },
          skills: [],
        });
      }
    }

    fetchProfile();
  }, []);

  const social = profileData?.social || {
    twitter: "",
    github: "",
    linkedin: "",
    googleScholar: "",
    researchGate: "",
    orcid: "",
  };

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Pouria Rouzrokh. All rights
              reserved.
            </p>
          </div>
          <SocialLinks social={social} />
        </div>
      </div>
    </footer>
  );
}
