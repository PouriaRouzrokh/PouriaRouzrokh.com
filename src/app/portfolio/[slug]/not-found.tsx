import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="container mx-auto py-24 text-center">
      <h1 className="text-4xl font-bold mb-6">Project Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Sorry, the project you&apos;re looking for doesn&apos;t exist or has
        been removed.
      </p>
      <Link href="/portfolio" passHref>
        <Button className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Button>
      </Link>
    </div>
  );
}
