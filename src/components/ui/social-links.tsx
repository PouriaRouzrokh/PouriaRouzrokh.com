"use client";

import { ProfileData } from "@/lib/types";

interface SocialLinksProps {
  social: ProfileData["social"];
  className?: string;
  iconSize?: number;
}

export function SocialLinks({
  social,
  className = "",
  iconSize = 18,
}: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {social.GitHub && (
        <a
          href={social.GitHub}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
        </a>
      )}

      {social.X && (
        <a
          href={social.X}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="X"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 512 462.799"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="nonzero"
              d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
            />
          </svg>
        </a>
      )}

      {social.LinkedIn && (
        <a
          href={social.LinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-linkedin"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect width="4" height="12" x="2" y="9"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
      )}

      {social.GoogleScholar && (
        <a
          href={social.GoogleScholar}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Google Scholar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 26 30"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M 10 0 L 0 9 L 6.78125 9 C 6.80125 11.847 8.967531 14.730469 12.769531 14.730469 C 13.129531 14.730469 13.529688 14.690391 13.929688 14.650391 C 13.749688 15.100391 13.560547 15.470078 13.560547 16.080078 C 13.560547 17.230078 14.140391 17.920078 14.650391 18.580078 C 13.020391 18.690078 9.989766 18.879531 7.759766 20.269531 C 5.629766 21.559531 4.980469 23.43 4.980469 24.75 C 4.980469 27.47 7.500469 30 12.730469 30 C 18.930469 30 22.220703 26.510547 22.220703 23.060547 C 22.220703 20.530547 20.779453 19.279922 19.189453 17.919922 L 17.900391 16.890625 C 17.500391 16.570625 16.949219 16.120312 16.949219 15.320312 C 16.949219 14.510313 17.500703 13.989766 17.970703 13.509766 C 19.480703 12.309766 21 10.960234 21 8.240234 C 21 7.197234 20.756203 6.348391 20.408203 5.650391 L 24 2.570312 L 24 6.277344 C 23.405 6.623344 23 7.261 23 8 L 23 14 C 23 15.104 23.896 16 25 16 C 26.104 16 27 15.104 27 14 L 27 8 C 27 7.262 26.595 6.624344 26 6.277344 L 26 1 C 26 0.957 25.980609 0.920906 25.974609 0.878906 L 27 0 L 10 0 z M 13.269531 3.240234 C 16.269531 3.240234 17.820312 7.35 17.820312 10 C 17.820312 10.65 17.739922 11.819922 16.919922 12.669922 C 16.339922 13.259922 15.370938 13.699219 14.460938 13.699219 C 11.370938 13.699219 9.949219 9.620156 9.949219 7.160156 C 9.949219 6.210156 10.14 5.220938 10.75 4.460938 C 11.33 3.710938 12.339531 3.240234 13.269531 3.240234 z M 15.039062 19.609375 C 15.409063 19.609375 15.590859 19.610391 15.880859 19.650391 C 18.620859 21.630391 19.800781 22.620234 19.800781 24.490234 C 19.800781 26.760234 17.97 28.460938 14.5 28.460938 C 10.64 28.460938 8.160156 26.590469 8.160156 23.980469 C 8.160156 21.370469 10.459766 20.499219 11.259766 20.199219 C 12.769766 19.679219 14.719062 19.609375 15.039062 19.609375 z" />
          </svg>
        </a>
      )}

      {social.ResearchGate && (
        <a
          href={social.ResearchGate}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="ResearchGate"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19.586 5.586a2 2 0 0 0-2.828 0L12 10.343 7.242 5.586a2 2 0 1 0-2.828 2.828L9.172 13.172a2 2 0 0 0 2.828 0L16.757 8.414a2 2 0 0 0 0-2.828Z" />
            <path d="M8 16c.5 1.5 2.358 2 4 2s3.5-.5 4-2" />
            <path d="M20 7h-3" />
            <path d="M20 11h-3" />
            <path d="M20 15h-3" />
            <path d="M4 7h3" />
            <path d="M4 11h3" />
            <path d="M4 15h3" />
          </svg>
        </a>
      )}

      {social.ORCID && (
        <a
          href={social.ORCID}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="ORCID"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="8" r="1" />
            <path d="M12 11v7" />
          </svg>
        </a>
      )}
    </div>
  );
}
