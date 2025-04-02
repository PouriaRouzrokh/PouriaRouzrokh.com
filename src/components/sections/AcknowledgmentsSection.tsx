import { SectionHeading } from "@/components/ui/section-heading";
import { AcknowledgmentItem } from "@/lib/types";

interface AcknowledgmentsSectionProps {
  acknowledgementsData: AcknowledgmentItem[];
}

export default function AcknowledgmentsSection({
  acknowledgementsData,
}: AcknowledgmentsSectionProps) {
  // Ensure we always have an array to work with
  const acknowledgmentItems = Array.isArray(acknowledgementsData)
    ? acknowledgementsData
    : [];

  return (
    <section className="py-8" id="acknowledgments">
      <SectionHeading
        title="Acknowledgments"
        subtitle="Mentors and influential people in my career"
      />
      <div className="space-y-6">
        {acknowledgmentItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {acknowledgmentItems.map((item, index) => (
              <div
                key={index}
                className="bg-card/40 p-6 rounded-lg border border-border/60 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.credentials}
                      </p>
                    </div>
                    <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {item.years}
                    </span>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-medium">
                      {item.title} •{" "}
                      <span className="text-muted-foreground">
                        {item.affiliation}
                      </span>
                    </p>
                  </div>

                  <p className="text-sm text-card-foreground mt-3">
                    {item.contribution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No acknowledgment data available
          </div>
        )}
      </div>
    </section>
  );
}
