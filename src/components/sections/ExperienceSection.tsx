import { SectionHeading } from "@/components/ui/section-heading";
import { ExperienceItem } from "@/lib/types";
import Image from "next/image";

interface ExperienceSectionProps {
  experienceData: ExperienceItem[];
}

export default function ExperienceSection({
  experienceData,
}: ExperienceSectionProps) {
  // Ensure we always have an array to work with
  const experienceItems = Array.isArray(experienceData) ? experienceData : [];

  // Filter out experience items mentioning "assistant professor" (commented out for now)
  const filteredExperienceItems = experienceItems.filter(
    (item) => !item.role?.toLowerCase().includes("assistant professor")
  );

  // Console log for debugging
  console.log("Experience data:", experienceData);

  return (
    <section className="py-8" id="experience">
      <SectionHeading
        title="Experience"
        subtitle="Professional roles and accomplishments"
      />
      <div className="space-y-6">
        {filteredExperienceItems.length > 0 ? (
          filteredExperienceItems.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div className="flex items-center gap-3">
                  {item.logoUrl && (
                    <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border bg-background">
                      <Image
                        src={item.logoUrl}
                        alt={`${item.organization} logo`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{item.role}</h3>
                    <p className="text-muted-foreground">{item.organization}</p>
                  </div>
                </div>
                <span className="text-sm bg-muted px-3 py-1 rounded-full border">
                  {item.years}
                </span>
              </div>
              <p className="mt-3 text-card-foreground">{item.description}</p>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No experience data available
          </div>
        )}
        {/* Commented out: Experience items mentioning "assistant professor" are filtered out above */}
      </div>
    </section>
  );
}
