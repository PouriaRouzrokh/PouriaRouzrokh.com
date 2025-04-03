import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import MaintenanceWrapper from "@/components/layout/MaintenanceWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pouria Rouzrokh - AI Researcher | Developer | Innovator",
  description:
    "Personal portfolio of Pouria Rouzrokh, featuring research, projects, and blog posts about AI and development.",
  keywords: [
    "AI",
    "Research",
    "Machine Learning",
    "Development",
    "Portfolio",
    "Biomedical Informatics",
  ],
  authors: [{ name: "Pouria Rouzrokh" }],
  creator: "Pouria Rouzrokh",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pouria.ai"),
  icons: {
    icon: [{ url: "/pr-logo.svg", type: "image/svg+xml" }],
    shortcut: ["/pr-logo.svg"],
    apple: [{ url: "/pr-logo.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pouria.ai",
    title: "Pouria Rouzrokh - AI Researcher | Developer | Innovator",
    description:
      "Personal portfolio of Pouria Rouzrokh, showcasing AI research, projects, and expertise",
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
    title: "Pouria Rouzrokh - AI Researcher | Developer | Innovator",
    description:
      "Personal portfolio of Pouria Rouzrokh, showcasing AI research, projects, and expertise",
    images: ["/og-image.jpg"],
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
