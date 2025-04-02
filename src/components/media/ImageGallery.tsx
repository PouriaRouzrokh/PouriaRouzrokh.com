"use client";

import Image from "next/image";
import { getResponsiveImageUrl } from "@/lib/media";

interface ImageGalleryProps {
  images: {
    src: string;
    alt?: string;
    title?: string;
  }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images.length) return null;

  // If there's only one image, display it normally
  if (images.length === 1) {
    const { src, alt, title } = images[0];
    const optimizedSrc = getResponsiveImageUrl(src);

    return (
      <div className="my-8">
        <Image
          src={optimizedSrc}
          alt={alt || ""}
          width={800}
          height={500}
          className="rounded-lg"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {title && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            {title}
          </p>
        )}
      </div>
    );
  }

  // For multiple images, create a grid
  return (
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images.map((image, index) => {
        const { src, alt, title } = image;
        const optimizedSrc = getResponsiveImageUrl(src);

        return (
          <div key={index} className="relative">
            <Image
              src={optimizedSrc}
              alt={alt || ""}
              width={400}
              height={300}
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            {title && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {title}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
