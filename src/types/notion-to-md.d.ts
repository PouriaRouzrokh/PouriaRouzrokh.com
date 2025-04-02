declare module "notion-to-md" {
  import { Client } from "@notionhq/client";

  export class NotionToMarkdown {
    constructor(options: { notionClient: Client });

    /**
     * Converts a Notion page to markdown blocks
     */
    pageToMarkdown(
      pageId: string,
      totalPage?: number
    ): Promise<MarkdownBlock[]>;

    /**
     * Converts markdown blocks to a markdown string
     */
    toMarkdownString(markdownBlocks: MarkdownBlock[]): { parent: string };

    /**
     * Converts a list of Notion blocks to markdown blocks
     */
    blocksToMarkdown(blocks: any[]): Promise<MarkdownBlock[]>;

    /**
     * Converts a single Notion block to a markdown string
     */
    blockToMarkdown(block: any): string;
  }

  export interface MarkdownBlock {
    parent: string;
    children: MarkdownBlock[];
  }
}
