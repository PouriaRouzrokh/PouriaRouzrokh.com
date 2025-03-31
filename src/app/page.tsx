import HeroSection from "@/components/sections/HeroSection";
import EducationSection from "@/components/sections/EducationSection";
import ResearchSummarySection from "@/components/sections/ResearchSummarySection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import { SectionDivider } from "@/components/ui/section-divider";
import {
  getProfile,
  getEducation,
  getResearch,
  getExperience,
  getAchievements,
} from "@/lib/data-fetching";

// This makes Next.js statically generate this page at build time
// and revalidate the data every 1 hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch all data on the server
  const [profile, education, research, experience, achievements] =
    await Promise.all([
      getProfile(),
      getEducation(),
      getResearch(),
      getExperience(),
      getAchievements(),
    ]);

  // Debug logging
  console.log("Server-side data fetched:");
  console.log("Profile:", JSON.stringify(profile).substring(0, 200) + "...");
  console.log(
    "Education:",
    JSON.stringify(education).substring(0, 200) + "..."
  );
  console.log("Research:", JSON.stringify(research).substring(0, 200) + "...");
  console.log(
    "Experience:",
    JSON.stringify(experience).substring(0, 200) + "..."
  );
  console.log(
    "Achievements:",
    JSON.stringify(achievements).substring(0, 200) + "..."
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection profileData={profile} />

      <SectionDivider />

      <div className="pt-4">
        <EducationSection educationData={education} />
      </div>

      <SectionDivider />

      <div className="pt-4">
        <ResearchSummarySection researchData={research} profileData={profile} />
      </div>

      <SectionDivider />

      <div className="pt-4">
        <ExperienceSection experienceData={experience} />
      </div>

      <SectionDivider />

      <div className="pt-4">
        <AchievementsSection achievementsData={achievements} />
      </div>
    </div>
  );
}
