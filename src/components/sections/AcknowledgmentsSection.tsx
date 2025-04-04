import { SectionHeading } from "@/components/ui/section-heading";
import { AcknowledgmentItem } from "@/lib/types";
import Image from "next/image";

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
        subtitle={
          <>
            Mentors and influential people in my career.
            <br />
            Years, titles and affiliations refer to the time of the mentorship.
          </>
        }
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
                    <div className="flex items-center gap-4">
                      {item.imageUrl ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={`Photo of ${item.name}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xl font-semibold">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.credentials}
                        </p>
                      </div>
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
