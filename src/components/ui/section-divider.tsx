import { Separator } from "@/components/ui/separator";

interface SectionDividerProps {
  className?: string;
  decorative?: boolean;
}

export function SectionDivider({
  className,
  decorative = true,
}: SectionDividerProps) {
  return (
    <div
      className={`w-full flex items-center justify-center py-6 ${className}`}
    >
      <div className="w-full max-w-[80%] flex items-center gap-4">
        <div className="h-1 w-2 rounded-full bg-primary/30" />
        <div className="h-1 w-3 rounded-full bg-primary/50" />
        <Separator
          className="h-px flex-grow bg-border"
          decorative={decorative}
        />
        <div className="h-1 w-3 rounded-full bg-primary/50" />
        <div className="h-1 w-2 rounded-full bg-primary/30" />
      </div>
    </div>
  );
}
