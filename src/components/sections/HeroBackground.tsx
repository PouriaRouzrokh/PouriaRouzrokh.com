interface HeroBackgroundProps {
  className?: string;
}

export default function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <svg
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <style>{`
        .svg-pulse {
          animation: svg-pulse 3.5s ease-in-out infinite;
        }
        .svg-pulse-d1 { animation-delay: 0.5s; }
        .svg-pulse-d2 { animation-delay: 1.0s; }
        .svg-pulse-d3 { animation-delay: 1.5s; }
        .svg-pulse-d4 { animation-delay: 2.0s; }
        .svg-pulse-d5 { animation-delay: 2.5s; }

        .svg-dash {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: svg-dash 7s linear infinite;
        }
        .svg-dash-d1 { animation-delay: 1s; }
        .svg-dash-d2 { animation-delay: 3s; }

        .svg-float {
          animation: svg-float 6s ease-in-out infinite;
        }
        .svg-float-d1 { animation-delay: 1.5s; }
        .svg-float-d2 { animation-delay: 3s; }

        @keyframes svg-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes svg-dash {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: -200; }
        }
        @keyframes svg-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .svg-pulse, .svg-dash, .svg-float {
            animation: none;
          }
        }
      `}</style>

      {/* Connection lines - static */}
      <g stroke="currentColor" fill="none" strokeWidth="1">
        {/* Connections from hub node at (780, 280) */}
        <line x1="780" y1="280" x2="680" y2="180" opacity="0.25" />
        <line x1="780" y1="280" x2="900" y2="220" opacity="0.2" />
        <line x1="780" y1="280" x2="720" y2="400" opacity="0.25" />
        <line x1="780" y1="280" x2="880" y2="350" opacity="0.2" />
        <line x1="780" y1="280" x2="650" y2="300" opacity="0.15" />

        {/* Connections from hub node at (1000, 180) */}
        <line x1="1000" y1="180" x2="900" y2="220" opacity="0.25" />
        <line x1="1000" y1="180" x2="1100" y2="120" opacity="0.2" />
        <line x1="1000" y1="180" x2="1080" y2="280" opacity="0.2" />
        <line x1="1000" y1="180" x2="920" y2="100" opacity="0.15" />

        {/* Connections from hub node at (920, 420) */}
        <line x1="920" y1="420" x2="880" y2="350" opacity="0.25" />
        <line x1="920" y1="420" x2="1040" y2="460" opacity="0.2" />
        <line x1="920" y1="420" x2="820" y2="500" opacity="0.2" />
        <line x1="920" y1="420" x2="1080" y2="280" opacity="0.15" />

        {/* Cross connections */}
        <line x1="680" y1="180" x2="620" y2="120" opacity="0.15" />
        <line x1="680" y1="180" x2="900" y2="220" opacity="0.15" />
        <line x1="720" y1="400" x2="820" y2="500" opacity="0.2" />
        <line x1="1100" y1="120" x2="1140" y2="220" opacity="0.15" />
        <line x1="1140" y1="220" x2="1080" y2="280" opacity="0.15" />

        {/* Far left sparse connections */}
        <line x1="480" y1="350" x2="560" y2="260" opacity="0.1" />
        <line x1="560" y1="260" x2="650" y2="300" opacity="0.12" />
        <line x1="480" y1="350" x2="650" y2="300" opacity="0.08" />
      </g>

      {/* Animated data flow paths */}
      <g stroke="currentColor" fill="none" strokeWidth="1.5">
        <path
          d="M 620 120 Q 700 200 780 280 Q 850 320 920 420"
          opacity="0.3"
          className="svg-dash"
        />
        <path
          d="M 920 100 Q 960 140 1000 180 Q 1040 230 1080 280"
          opacity="0.25"
          className="svg-dash svg-dash-d1"
        />
        <path
          d="M 780 280 Q 830 310 880 350 Q 900 380 920 420 Q 980 440 1040 460"
          opacity="0.25"
          className="svg-dash svg-dash-d2"
        />
      </g>

      {/* Nodes */}
      <g fill="currentColor">
        {/* Hub nodes (larger, r=5-6) */}
        <circle cx="780" cy="280" r="6" opacity="0.6" className="svg-pulse" />
        <circle cx="1000" cy="180" r="5" opacity="0.55" className="svg-pulse svg-pulse-d2" />
        <circle cx="920" cy="420" r="5.5" opacity="0.5" className="svg-pulse svg-pulse-d4" />

        {/* Medium nodes (r=4) */}
        <circle cx="900" cy="220" r="4" opacity="0.45" className="svg-float" />
        <circle cx="880" cy="350" r="4" opacity="0.4" className="svg-pulse svg-pulse-d1" />
        <circle cx="680" cy="180" r="4" opacity="0.45" className="svg-float svg-float-d1" />
        <circle cx="1080" cy="280" r="4" opacity="0.4" className="svg-pulse svg-pulse-d3" />

        {/* Small nodes (r=3) */}
        <circle cx="720" cy="400" r="3" opacity="0.35" />
        <circle cx="650" cy="300" r="3" opacity="0.3" className="svg-pulse svg-pulse-d5" />
        <circle cx="1100" cy="120" r="3" opacity="0.35" className="svg-float svg-float-d2" />
        <circle cx="1140" cy="220" r="3" opacity="0.3" />
        <circle cx="1040" cy="460" r="3" opacity="0.35" />
        <circle cx="820" cy="500" r="3" opacity="0.3" />
        <circle cx="920" cy="100" r="3" opacity="0.35" />
        <circle cx="620" cy="120" r="3" opacity="0.3" />

        {/* Far left sparse nodes */}
        <circle cx="480" cy="350" r="3" opacity="0.2" />
        <circle cx="560" cy="260" r="3" opacity="0.2" />
      </g>
    </svg>
  );
}
