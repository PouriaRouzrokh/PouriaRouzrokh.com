"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Research", href: "/research" },
    { label: "Portfolio", href: "/portfolio" },
    // { label: "Blog", href: "/blog" }, // Hidden — blog temporarily disabled
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Folding or rotating a phone resizes the page without a reload: close the
  // mobile menu once the desktop links are back, so it does not reopen later.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMobileMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/pr-logo.svg"
            alt="PR Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-bold text-xl">Pouria Rouzrokh</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-2 py-3 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-md hover:bg-accent"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <ul className="container mx-auto px-4 py-2 flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block py-3 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
