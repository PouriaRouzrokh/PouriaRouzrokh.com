export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 animate-pulse">
      {/* Initial loading indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg animate-bounce">
        Loading post...
      </div>

      {/* Back to blog link skeleton */}
      <div className="mb-8">
        <div className="inline-flex items-center h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Blog post header skeleton */}
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 h-6 w-16"
            ></div>
          ))}
        </div>

        <div className="mb-4 h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

        <div className="flex items-center">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </header>

      {/* Featured image skeleton */}
      <div className="mb-10 h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

      {/* Blog post content skeleton */}
      <article className="mx-auto max-w-4xl space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
          ></div>
        ))}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
          ></div>
        ))}
      </article>
    </div>
  );
}
