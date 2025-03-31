import { SectionHeading } from "@/components/ui/section-heading";
import { ExperienceItem } from "@/lib/types";

interface ExperienceSectionProps {
  experienceData: ExperienceItem[];
}

export default function ExperienceSection({
  experienceData,
}: ExperienceSectionProps) {
  // Ensure we always have an array to work with
  const experienceItems = Array.isArray(experienceData) ? experienceData : [];

  // Console log for debugging
  console.log("Experience data:", experienceData);

  return (
    <section className="py-8" id="experience">
      <SectionHeading
        title="Experience"
        subtitle="Professional roles and accomplishments"
      />
      <div className="space-y-6">
        {experienceItems.length > 0 ? (
          experienceItems.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <h3 className="text-xl font-semibold">{item.role}</h3>
                  <p className="text-muted-foreground">{item.organization}</p>
                </div>
                <span className="text-sm bg-muted px-3 py-1 rounded-full border">
                  {item.years}
                </span>
              </div>
              <ul className="mt-3 space-y-1">
                {Array.isArray(item.description) ? (
                  item.description.map((point, i) => (
                    <li key={i} className="pl-4 relative">
                      <span className="absolute left-0 text-primary">•</span>
                      {point}
                    </li>
                  ))
                ) : (
                  <li className="pl-4 relative">
                    <span className="absolute left-0 text-primary">•</span>
                    {item.description}
                  </li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No experience data available
          </div>
        )}
      </div>
    </section>
  );
}
