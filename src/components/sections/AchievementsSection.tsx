import { SectionHeading } from "@/components/ui/section-heading";
import { AchievementItem } from "@/lib/types";

interface AchievementsSectionProps {
  achievementsData: AchievementItem[];
}

export default function AchievementsSection({
  achievementsData,
}: AchievementsSectionProps) {
  // Ensure we always have an array to work with
  const achievementItems = Array.isArray(achievementsData)
    ? achievementsData
    : [];

  // Console log for debugging
  console.log("Achievements data:", achievementsData);

  return (
    <section className="py-8" id="achievements">
      <SectionHeading
        title="Achievements"
        subtitle="Awards and honors received"
      />
      <div className="space-y-6">
        {achievementItems.length > 0 ? (
          achievementItems.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{item.organization}</p>
                </div>
                <span className="text-sm bg-muted px-3 py-1 rounded-full">
                  {item.year}
                </span>
              </div>
              <p className="mt-3 text-card-foreground">{item.description}</p>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No achievements data available
          </div>
        )}
      </div>
    </section>
  );
}
