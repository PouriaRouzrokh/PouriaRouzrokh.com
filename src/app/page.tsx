import HeroSection from "@/components/sections/HeroSection";
import EducationSection from "@/components/sections/EducationSection";
import ResearchSummarySection from "@/components/sections/ResearchSummarySection";
import ExperienceSection from "@/components/sections/ExperienceSection";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <HeroSection />
      <EducationSection />
      <ResearchSummarySection />
      <ExperienceSection />
    </div>
  );
}
