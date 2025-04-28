import { Metadata } from "next";
import { getProfile } from "@/lib/data-fetching";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About Pouria Rouzrokh | AI Researcher & Developer",
  description:
    "Learn more about Pouria Rouzrokh, an AI researcher and developer specializing in artificial intelligence and machine learning.",
  keywords: [
    "About Pouria Rouzrokh",
    "Pouria Rouzrokh bio",
    "Pouria Rouzrokh background",
    "Pouria Rouzrokh profile",
    "Who is Pouria Rouzrokh",
    "Pouria Rouzrokh AI researcher",
  ],
};

export default async function AboutPage() {
  const profile = await getProfile();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pouria Rouzrokh",
    alternateName: ["Dr. Pouria Rouzrokh", "Pouria R.", "P. Rouzrokh"],
    url: "https://PouriaRouzrokh.com",
    mainEntityOfPage: "https://PouriaRouzrokh.com/about",
    jobTitle: "AI Researcher & Developer",
    description:
      profile?.bio ||
      "AI Researcher and Developer specializing in artificial intelligence and machine learning",
    sameAs: [
      profile?.social?.GitHub
        ? `https://github.com/${profile.social.GitHub}`
        : "",
      profile?.social?.X ? `https://x.com/${profile.social.X}` : "",
      profile?.social?.LinkedIn
        ? `https://linkedin.com/in/${profile.social.LinkedIn}`
        : "",
      profile?.social?.GoogleScholar
        ? `https://scholar.google.com/citations?user=${profile.social.GoogleScholar}`
        : "",
      profile?.social?.ResearchGate
        ? `https://www.researchgate.net/profile/${profile.social.ResearchGate}`
        : "",
      profile?.social?.ORCID ? `https://orcid.org/${profile.social.ORCID}` : "",
    ].filter(Boolean),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={personJsonLd} />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Pouria Rouzrokh</h1>

        <div className="prose prose-lg dark:prose-invert">
          <h2 className="text-2xl font-semibold mb-4">Biography</h2>
          <p className="mb-6">{profile?.bio || "Loading biography..."}</p>

          <h2 className="text-2xl font-semibold mb-4">Expertise & Interests</h2>
          <p className="mb-6">
            Pouria Rouzrokh is an AI researcher and developer with expertise in
            machine learning, artificial intelligence, and biomedical
            informatics. His work focuses on developing innovative AI solutions
            for real-world problems.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            Professional Background
          </h2>
          <p className="mb-6">
            With a strong academic and industry background, Pouria has
            contributed to multiple research projects and software developments.
            He combines theoretical knowledge with practical implementation
            skills to create impactful solutions.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Connect with Pouria</h2>
          <p>
            You can connect with Pouria Rouzrokh through various platforms.
            Visit the
            <a
              href="/contact"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mx-1"
            >
              contact page
            </a>
            for more information or check out his profiles on social media:
          </p>
          <br />
          <ul className="list-disc pl-5">
            {Object.entries(profile?.social || {}).map(([key, value]) => (
              <li key={key} className="hover:underline">
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {key}
                </a>
                <br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
