import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto py-24 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-extrabold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The page you are looking for could not be found or does not exist.
      </p>
      <Link href="/" passHref>
        <Button className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
}
