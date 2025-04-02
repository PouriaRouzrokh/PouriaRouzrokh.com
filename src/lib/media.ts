/**
 * Media utility functions for responsive images and video embeds
 */

/**
 * Transforms a Cloudinary URL to get a responsive version with the specified width
 * @param baseUrl The original Cloudinary URL
 * @param width The desired width for the image
 * @returns Transformed Cloudinary URL with width parameter
 */
export function getResponsiveImageUrl(baseUrl: string, width = 800): string {
  // Check if it's a Cloudinary URL
  if (!baseUrl || !baseUrl.includes("cloudinary.com")) {
    return baseUrl;
  }

  return baseUrl.replace("/upload/", `/upload/c_scale,w_${width}/`);
}

/**
 * Extracts YouTube video ID from a YouTube URL
 * @param youtubeUrl The YouTube URL
 * @returns The YouTube embed URL or null if not a valid YouTube URL
 */
export function getYouTubeEmbedUrl(youtubeUrl: string): string | null {
  if (!youtubeUrl) return null;

  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = youtubeUrl.match(regex);

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/**
 * Calculates reading time for a given text
 * @param text The content to calculate reading time for
 * @returns Reading time information
 */
export function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    text: `${minutes} min read`,
    minutes,
    time: minutes * 60 * 1000,
    words,
  };
}
