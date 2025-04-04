interface SectionHeadingProps {
  title: string;
  subtitle?: string | React.ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`space-y-1 mb-6 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-sm md:text-base max-w-[80ch]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
