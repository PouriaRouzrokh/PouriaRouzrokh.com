export default function ExperienceSection() {
  // In a real implementation, this would fetch data from experience.json
  const experienceItems = [
    {
      role: "Senior AI Researcher",
      organization: "Tech Innovations Inc.",
      years: "2022 - Present",
      description: [
        "Led research projects on deep learning for medical imaging.",
        "Developed and deployed predictive models achieving 95% accuracy.",
        "Mentored junior researchers and engineers."
      ]
    },
    {
      role: "Research Assistant",
      organization: "Example University Lab",
      years: "2019 - 2022",
      description: [
        "Contributed to the development of algorithms for natural language processing.",
        "Published findings in peer-reviewed journals.",
        "Presented research at international conferences."
      ]
    }
  ];

  return (
    <section className="py-8" id="experience">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Experience</h2>
      <div className="space-y-6">
        {experienceItems.map((item, index) => (
          <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-xl font-semibold">{item.role}</h3>
                <p className="text-muted-foreground">{item.organization}</p>
              </div>
              <span className="text-sm bg-muted px-3 py-1 rounded-full">
                {item.years}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {Array.isArray(item.description) ? (
                item.description.map((point, i) => (
                  <li key={i} className="pl-4 relative">
                    <span className="absolute left-0">•</span>
                    {point}
                  </li>
                ))
              ) : (
                <li className="pl-4 relative">
                  <span className="absolute left-0">•</span>
                  {item.description}
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
} 