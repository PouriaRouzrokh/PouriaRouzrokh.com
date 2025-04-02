import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">Blog Post Not Found</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        The blog post you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Blog
      </Link>
    </div>
  );
}
