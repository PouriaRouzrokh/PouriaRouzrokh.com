"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({
  videoId,
  title = "YouTube video",
}: YouTubeEmbedProps) {
  return (
    <div className="aspect-w-16 aspect-h-9 my-8 overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
