import { SectionHeading } from "@/components/ui/section-heading";

export default function EducationSection() {
  // In a real implementation, this would fetch data from education.json
  const educationItems = [
    {
      degree: "PhD in Biomedical Informatics",
      institution: "Example University",
      years: "2018 - 2022",
      description:
        "Dissertation focused on machine learning applications in medical imaging.",
    },
    {
      degree: "MSc in Computer Science",
      institution: "Another University",
      years: "2016 - 2018",
      description: "Specialized in Artificial Intelligence.",
    },
  ];

  return (
    <section className="py-8" id="education">
      <SectionHeading
        title="Education"
        subtitle="Academic background and qualifications"
      />
      <div className="space-y-6">
        {educationItems.map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-xl font-semibold">{item.degree}</h3>
                <p className="text-muted-foreground">{item.institution}</p>
              </div>
              <span className="text-sm bg-muted px-3 py-1 rounded-full">
                {item.years}
              </span>
            </div>
            <p className="mt-3 text-card-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
