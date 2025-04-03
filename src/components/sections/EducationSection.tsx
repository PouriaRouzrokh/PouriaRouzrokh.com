import { SectionHeading } from "@/components/ui/section-heading";
import { EducationItem } from "@/lib/types";
import Image from "next/image";

interface EducationSectionProps {
  educationData: EducationItem[];
}

export default function EducationSection({
  educationData,
}: EducationSectionProps) {
  // Ensure we always have an array to work with
  const educationItems = Array.isArray(educationData) ? educationData : [];

  // Console log for debugging
  console.log("Education data:", educationData);

  return (
    <section className="py-8" id="education">
      <SectionHeading
        title="Education"
        subtitle="Academic background and qualifications"
      />
      <div className="space-y-6">
        {educationItems.length > 0 ? (
          educationItems.map((item, index) => (
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
                        alt={`${item.institution} logo`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{item.degree}</h3>
                    <p className="text-muted-foreground">{item.institution}</p>
                  </div>
                </div>
                <span className="text-sm bg-muted px-3 py-1 rounded-full">
                  {item.years}
                </span>
              </div>
              <p className="mt-3 text-card-foreground">{item.description}</p>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No education data available
          </div>
        )}
      </div>
    </section>
  );
}
