import HeroSection from "@/components/sections/HeroSection";
import EducationSection from "@/components/sections/EducationSection";
import ResearchSummarySection from "@/components/sections/ResearchSummarySection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import { SectionDivider } from "@/components/ui/section-divider";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />

      <SectionDivider />

      <div className="pt-4">
        <EducationSection />
      </div>

      <SectionDivider />

      <div className="pt-4">
        <ResearchSummarySection />
      </div>

      <SectionDivider />

      <div className="pt-4">
        <ExperienceSection />
      </div>
    </div>
  );
}
