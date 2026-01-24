"use client";

import Link from "next/link";
import Image from "next/image";
import { ProfileData } from "@/lib/types";
import { useState } from "react";
import { SocialLinks } from "@/components/ui/social-links";

interface HeroSectionProps {
  profileData: ProfileData;
}

export default function HeroSection({ profileData }: HeroSectionProps) {
  // Set defaults in case data is null or undefined
  const profile = profileData || {
    name: "Portfolio",
    title: "Developer & Researcher",
    bio: "Welcome to my portfolio website.",
    image: "/placeholder-profile.jpg",
    social: {
      X: "",
      GitHub: "",
      LinkedIn: "",
      GoogleScholar: "",
      ResearchGate: "",
      ORCID: "",
    },
  };

  // Clean image path - remove query parameters that might cause issues
  const cleanImagePath = profile.image
    ? profile.image.split("?")[0]
    : "/placeholder-profile.jpg";

  // State to handle image loading failures
  const [imgSrc, setImgSrc] = useState(cleanImagePath);
  const [imgError, setImgError] = useState(false);

  // Split titles by pipe character for better display
  const titles = profile.title.split(" - ");

  // Filter out titles mentioning "assistant professor" (commented out for now)
  const filteredTitles = titles.filter(
    (title) => !title.toLowerCase().includes("assistant professor")
  );

  // Console log for debugging
  console.log("Profile data in hero:", profileData);

  return (
    <section className="py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {profile.name}
            </h1>
            {profile.credentials && (
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                {profile.credentials}
              </p>
            )}
          </div>

          {/* First title with primary styling */}
          <div className="pt-1">
            {filteredTitles.length > 0 && (
              <p className="text-xl font-medium text-primary mb-1.5">
                {filteredTitles[0]}
              </p>
            )}

            {/* Secondary titles with compact styling */}
            {/* Commented out: titles mentioning "assistant professor" are filtered out */}
            {filteredTitles.length > 1 && (
              <div className="text-sm text-muted-foreground leading-tight space-y-1">
                {filteredTitles.slice(1).map((title, index) => (
                  <p key={index}>{title}</p>
                ))}
              </div>
            )}
          </div>

          <div className="py-4">
            <p className="text-lg leading-relaxed">{profile.bio}</p>
          </div>
          <div className="flex gap-4 pt-1">
            <Link
              href="/portfolio"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-md shadow-sm font-medium"
            >
              View Portfolio
            </Link>
            <Link
              href="/research"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-5 py-2.5 rounded-md shadow-sm font-medium"
            >
              View Research
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="pt-2">
            <SocialLinks social={profile.social} className="mt-1" />
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden bg-muted">
            {!imgError ? (
              <Image
                src={imgSrc}
                alt={profile.name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  console.error("Image load error:", e);
                  // If profile image fails, try the default placeholder
                  if (imgSrc !== "/placeholder-profile.jpg") {
                    console.log(
                      "Profile image not found, using placeholder instead"
                    );
                    setImgSrc("/placeholder-profile.jpg");
                  } else {
                    // If even the placeholder fails, show a colored background instead
                    console.log(
                      "Placeholder image also not found, using colored background"
                    );
                    setImgError(true);
                  }
                }}
                onLoadingComplete={() => {
                  console.log("Image loaded successfully:", imgSrc);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/20">
                <span className="text-4xl font-bold text-primary">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
