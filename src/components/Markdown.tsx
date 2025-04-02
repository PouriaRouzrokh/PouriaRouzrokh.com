"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { getResponsiveImageUrl, getYouTubeEmbedUrl } from "@/lib/media";
import YouTubeEmbed from "@/components/media/YouTubeEmbed";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          // Custom image component with Next.js Image
          img: ({ ...props }) => {
            const src = props.src || "";

            // Process Cloudinary URLs for responsive images
            const optimizedSrc = getResponsiveImageUrl(src);

            return (
              <div className="my-8">
                <Image
                  src={optimizedSrc}
                  alt={props.alt || ""}
                  width={800}
                  height={500}
                  className="rounded-lg"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                {props.title && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {props.title}
                  </p>
                )}
              </div>
            );
          },

          // Custom code block with syntax highlighting
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            return !inline ? (
              <div className="my-6 overflow-hidden rounded-lg">
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  PreTag="div"
                  className="text-sm"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-secondary px-1 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Process iframe elements for YouTube embeds
          iframe: ({ ...props }) => {
            const src = props.src || "";

            // Check if it's a YouTube embed
            if (src.includes("youtube.com/embed/")) {
              const videoId = src.split("/").pop() || "";
              return <YouTubeEmbed videoId={videoId} title={props.title} />;
            }

            // Default iframe handling
            return (
              <div className="my-8">
                <iframe {...props} className="w-full rounded-lg aspect-video" />
              </div>
            );
          },

          // Handle links specially
          a: ({ ...props }) => {
            const href = props.href || "";
            const isExternal = href.startsWith("http");

            // Check if it's a YouTube link that needs to be embedded
            if (
              href.includes("youtube.com/watch") ||
              href.includes("youtu.be/")
            ) {
              const embedUrl = getYouTubeEmbedUrl(href);
              if (embedUrl) {
                const videoId = embedUrl.split("/").pop() || "";
                return <YouTubeEmbed videoId={videoId} title={props.title} />;
              }
            }

            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-primary hover:underline"
                {...props}
              />
            );
          },

          // Enhanced heading components with anchor links
          h1: ({ ...props }) => (
            <h1
              className="scroll-m-20 text-4xl font-bold tracking-tight mt-8 mb-4"
              {...props}
            >
              {props.children}
            </h1>
          ),
          h2: ({ ...props }) => (
            <h2
              className="scroll-m-20 text-3xl font-bold tracking-tight mt-8 mb-4"
              {...props}
            >
              {props.children}
            </h2>
          ),
          h3: ({ ...props }) => (
            <h3
              className="scroll-m-20 text-2xl font-bold tracking-tight mt-6 mb-3"
              {...props}
            >
              {props.children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
