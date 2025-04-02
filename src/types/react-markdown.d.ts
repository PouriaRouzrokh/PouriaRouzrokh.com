declare module "react-markdown" {
  import {
    ReactNode,
    ComponentType,
    HTMLAttributes,
    ClassAttributes,
  } from "react";

  export interface ReactMarkdownProps {
    children: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: {
      [key: string]: ComponentType<any>;
    };
  }

  export interface CodeProps extends HTMLAttributes<HTMLElement> {
    inline?: boolean;
    className?: string;
    children: ReactNode;
  }

  export interface MarkdownImageProps extends HTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
    title?: string;
  }

  export interface MarkdownIframeProps
    extends HTMLAttributes<HTMLIFrameElement> {
    src?: string;
    title?: string;
  }

  export interface MarkdownLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    href?: string;
    title?: string;
  }

  const ReactMarkdown: ComponentType<ReactMarkdownProps>;
  export default ReactMarkdown;
}
