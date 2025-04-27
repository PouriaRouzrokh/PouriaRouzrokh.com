import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import MaintenanceWrapper from "@/components/layout/MaintenanceWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pouria Rouzrokh | AI Researcher & Developer | PouriaRouzrokh.com",
  description:
    "Pouria Rouzrokh's official website. Pouria Rouzrokh is an AI researcher, developer, and innovator. Explore my projects, research, and expertise in artificial intelligence.",
  keywords: [
    "Pouria Rouzrokh",
    "Pouria",
    "PouriaRouzrokh.com",
    "AI",
    "Research",
    "Machine Learning",
    "Development",
    "Portfolio",
    "Biomedical Informatics",
    "Artificial Intelligence Expert",
  ],
  authors: [{ name: "Pouria Rouzrokh", url: "https://PouriaRouzrokh.com" }],
  creator: "Pouria Rouzrokh",
  publisher: "Pouria Rouzrokh",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://PouriaRouzrokh.com"
  ),
  alternates: {
    canonical: "https://PouriaRouzrokh.com",
  },
  icons: {
    icon: [{ url: "/pr-logo.svg", type: "image/svg+xml" }],
    shortcut: ["/pr-logo.svg"],
    apple: [{ url: "/pr-logo.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://PouriaRouzrokh.com",
    title: "Pouria Rouzrokh | AI Researcher & Developer | PouriaRouzrokh.com",
    description:
      "Official website of Pouria Rouzrokh - AI researcher, developer, and innovator specialized in artificial intelligence and machine learning.",
    siteName: "Pouria Rouzrokh's Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pouria Rouzrokh Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pouria Rouzrokh | AI Researcher & Developer | PouriaRouzrokh.com",
    description:
      "Official website of Pouria Rouzrokh - AI researcher, developer, and innovator specialized in artificial intelligence and machine learning.",
    images: ["/og-image.jpg"],
    creator: "@pouriarz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MaintenanceWrapper>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </MaintenanceWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
