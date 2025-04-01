import { Metadata } from "next";
import { ResearchList } from "@/components/sections/ResearchList";

export const metadata: Metadata = {
  title: "Research Publications",
  description:
    "Browse academic publications, research papers, and scholarly articles",
};

export default function ResearchPage() {
  return <ResearchList />;
}
