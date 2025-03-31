"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  // In a real implementation, this would fetch data from profile.json
  return (
    <section className="py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Pouria Rouzrokh
          </h1>
          <p className="text-xl text-muted-foreground">
            AI Researcher | Developer | Innovator
          </p>
          <div className="py-4">
            <p className="text-lg">
              Welcome to my portfolio website. This is a placeholder for a brief
              professional biography highlighting key interests and expertise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 py-2">
            <span className="bg-secondary px-3 py-1 text-sm rounded-full">
              PhD in Biomedical Informatics
            </span>
            <span className="bg-secondary px-3 py-1 text-sm rounded-full">
              MSc in Computer Science
            </span>
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
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-muted">
            <Image
              src="/placeholder-profile.jpg"
              alt="Pouria Rouzrokh"
              fill
              className="object-cover"
              priority
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                console.error("Error loading profile image");
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
