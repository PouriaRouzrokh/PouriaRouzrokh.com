import HeroSection from "@/components/sections/HeroSection";
import EducationSection from "@/components/sections/EducationSection";
import ResearchSummarySection from "@/components/sections/ResearchSummarySection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import AcknowledgmentsSection from "@/components/sections/AcknowledgmentsSection";
// import { SectionDivider } from "@/components/ui/section-divider";
import {
  getProfile,
  getEducation,
  getResearch,
  getExperience,
  getAchievements,
  getAcknowledgments,
} from "@/lib/data-fetching";
import { JsonLd } from "@/components/seo/JsonLd";

// This makes Next.js statically generate this page at build time
// and revalidate the data every 1 hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch all data on the server
  const [
    profile,
    education,
    research,
    experience,
    achievements,
    acknowledgments,
  ] = await Promise.all([
    getProfile(),
    getEducation(),
    getResearch(),
    getExperience(),
    getAchievements(),
    getAcknowledgments(),
  ]);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pouria Rouzrokh",
    alternateName: ["Dr. Pouria Rouzrokh", "Pouria R.", "P. Rouzrokh"],
    url: "https://PouriaRouzrokh.com",
    mainEntityOfPage: "https://PouriaRouzrokh.com",
    jobTitle: "AI Researcher & Developer",
    description:
      profile?.bio ||
      "AI Researcher and Developer specializing in artificial intelligence and machine learning",
    sameAs: [
      profile?.social?.github
        ? `https://github.com/${profile.social.github}`
        : "",
      profile?.social?.twitter
        ? `https://twitter.com/${profile.social.twitter}`
        : "",
      profile?.social?.linkedin
        ? `https://linkedin.com/in/${profile.social.linkedin}`
        : "",
      profile?.social?.googleScholar
        ? `https://scholar.google.com/citations?user=${profile.social.googleScholar}`
        : "",
      profile?.social?.researchGate
        ? `https://www.researchgate.net/profile/${profile.social.researchGate}`
        : "",
      profile?.social?.orcid ? `https://orcid.org/${profile.social.orcid}` : "",
    ].filter(Boolean),
    alumniOf:
      education?.map((edu) => ({
        "@type": "EducationalOrganization",
        name: edu.institution,
      })) || [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://PouriaRouzrokh.com",
    name: "Pouria Rouzrokh | AI Researcher & Developer",
    description:
      "Official website of Pouria Rouzrokh - AI researcher, developer, and innovator",
    author: {
      "@type": "Person",
      name: "Pouria Rouzrokh",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://PouriaRouzrokh.com/?s={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={personJsonLd} />
      <JsonLd data={websiteJsonLd} />

      <HeroSection profileData={profile} />

      {/* <SectionDivider /> */}

      <div className="pt-4">
        <EducationSection educationData={education} />
      </div>

      {/* <SectionDivider /> */}

      <div className="pt-4">
        <ResearchSummarySection researchData={research} profileData={profile} />
      </div>

      {/* <SectionDivider /> */}

      <div className="pt-4">
        <ExperienceSection experienceData={experience} />
      </div>

      {/* <SectionDivider /> */}

      <div className="pt-4">
        <AchievementsSection achievementsData={achievements} />
      </div>

      {/* <SectionDivider /> */}

      <div className="pt-4">
        <AcknowledgmentsSection acknowledgementsData={acknowledgments} />
      </div>
    </div>
  );
}
