import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

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

// Check if maintenance mode is enabled (default to false if not set)
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (MAINTENANCE_MODE) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
              <h1 className="text-4xl font-bold mb-6">Coming Soon</h1>
              <p className="text-xl text-muted-foreground max-w-md mb-8">
                This website is currently under development and will be
                available soon.
              </p>
              <div className="w-24 h-24 border-t-4 border-primary rounded-full animate-spin"></div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
