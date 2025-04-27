import { Metadata } from "next";
import { PortfolioList } from "@/components/sections/PortfolioList";

export const metadata: Metadata = {
  title: "Portfolio & Projects | Pouria Rouzrokh",
  description:
    "Explore my portfolio of projects, including web development, AI, and data science work",
};

export default function PortfolioPage() {
  return <PortfolioList />;
}
