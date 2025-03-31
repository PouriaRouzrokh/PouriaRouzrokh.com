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
    interests: [],
    image: "/placeholder-profile.jpg",
    social: {
      twitter: "",
      github: "",
      linkedin: "",
      googleScholar: "",
    },
  };

  // State to handle image loading failures
  const [imgSrc, setImgSrc] = useState(
    profile.image || "/placeholder-profile.jpg"
  );
  const [imgError, setImgError] = useState(false);

  // Console log for debugging
  console.log("Profile data in hero:", profileData);

  return (
    <section className="py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {profile.name}
          </h1>
          <p className="text-xl text-muted-foreground">{profile.title}</p>
          <div className="py-4">
            <p className="text-lg">{profile.bio}</p>
          </div>
          <div className="flex flex-wrap gap-3 py-2">
            {profile.interests &&
              profile.interests.slice(0, 2).map((interest, index) => (
                <span
                  key={index}
                  className="bg-secondary px-3 py-1 text-sm rounded-full"
                >
                  {interest}
                </span>
              ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Link
              href="/research"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              View Research
            </Link>
            <Link
              href="/contact"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md"
            >
              Contact Me
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="pt-4">
            <SocialLinks social={profile.social} className="mt-2" />
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-muted">
            {!imgError ? (
              <Image
                src={imgSrc}
                alt={profile.name}
                fill
                className="object-cover"
                priority
                onError={() => {
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
