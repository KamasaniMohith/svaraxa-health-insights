interface Props {
  value: number; // 0-100
}

export function RiskGauge({ value }: Props) {
  const v = Math.max(0, Math.min(100, value));
  const color = v < 30 ? "var(--success)" : v < 60 ? "var(--warning)" : "var(--danger)";
  const label = v < 30 ? "LOW" : v < 60 ? "MEDIUM" : "HIGH";

  // Semi-circle gauge using SVG
  const radius = 110;
  const circ = Math.PI * radius;
  const offset = circ - (v / 100) * circ;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width="280" height="170" viewBox="0 0 280 170" className="overflow-visible">
        <defs>
          <linearGradient id="gaugeBg" x1="0" x2="1">
            <stop offset="0" stopColor="var(--success)" />
            <stop offset="0.5" stopColor="var(--warning)" />
            <stop offset="1" stopColor="var(--danger)" />
          </linearGradient>
        </defs>
        {/* bg track */}
        <path d="M 30 150 A 110 110 0 0 1 250 150" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="18" strokeLinecap="round" />
        {/* gradient track faint */}
        <path d="M 30 150 A 110 110 0 0 1 250 150" fill="none" stroke="url(#gaugeBg)" strokeOpacity="0.25" strokeWidth="18" strokeLinecap="round" />
        {/* value arc */}
        <path
          d="M 30 150 A 110 110 0 0 1 250 150"
          fill="none"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1), stroke 0.6s" }}
          filter={`drop-shadow(0 0 12px ${color})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <div className="text-6xl font-bold tabular-nums" style={{ color }}>{v}<span className="text-2xl">%</span></div>
        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Risk Score</div>
      </div>
      <span
        className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`, color, border: `1px solid color-mix(in oklab, ${color} 40%, transparent)` }}
      >
        <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        {label} RISK
      </span>
    </div>
  );
}
