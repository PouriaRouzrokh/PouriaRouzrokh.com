"use client";

import Link from "next/link";
import Image from "next/image";
import { ProfileData } from "@/lib/types";
import { useState } from "react";
import { SocialLinks } from "@/components/ui/social-links";
import HeroBackground from "@/components/sections/HeroBackground";

interface HeroSectionProps {
  profileData: ProfileData;
}

export default function HeroSection({ profileData }: HeroSectionProps) {
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

  const cleanImagePath = profile.image
    ? profile.image.split("?")[0]
    : "/placeholder-profile.jpg";

  const [imgSrc, setImgSrc] = useState(cleanImagePath);
  const [imgError, setImgError] = useState(false);

  const titles = profile.title.split(" - ");
  const filteredTitles = titles.filter(
    (title) => !title.toLowerCase().includes("assistant professor")
  );

  return (
    <section className="relative py-16 md:py-24">
      {/* SVG Background */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
        <HeroBackground className="w-full h-full opacity-20 dark:opacity-20" />
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="opacity-0 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {profile.name}
            </h1>
            {profile.credentials && (
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                {profile.credentials}
              </p>
            )}
          </div>

          <div className="pt-1 opacity-0 animate-fade-in-up [animation-delay:100ms]">
            {filteredTitles.length > 0 && (
              <p className="text-xl font-medium text-primary mb-1.5">
                {filteredTitles[0]}
              </p>
            )}

            {filteredTitles.length > 1 && (
              <div className="text-sm text-muted-foreground leading-tight space-y-1">
                {filteredTitles.slice(1).map((title, index) => (
                  <p key={index}>{title}</p>
                ))}
              </div>
            )}
          </div>

          <div className="py-4 opacity-0 animate-fade-in-up [animation-delay:200ms]">
            <p className="text-lg leading-relaxed">{profile.bio}</p>
          </div>

          <div className="flex gap-4 pt-1 opacity-0 animate-fade-in-up [animation-delay:300ms]">
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

          <div className="pt-2 opacity-0 animate-fade-in-up [animation-delay:400ms]">
            <SocialLinks social={profile.social} className="mt-1" />
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden bg-muted shadow-lg opacity-0 animate-scale-in [animation-delay:200ms]">
            {!imgError ? (
              <Image
                src={imgSrc}
                alt={profile.name}
                fill
                className="object-cover"
                priority
                onError={() => {
                  if (imgSrc !== "/placeholder-profile.jpg") {
                    setImgSrc("/placeholder-profile.jpg");
                  } else {
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
