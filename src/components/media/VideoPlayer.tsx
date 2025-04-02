"use client";

interface VideoPlayerProps {
  src: string;
  title?: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  return (
    <div className="my-8">
      <video
        src={src}
        title={title}
        controls
        className="w-full rounded-lg aspect-video"
        preload="metadata"
      />
      {title && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          {title}
        </p>
      )}
    </div>
  );
}
