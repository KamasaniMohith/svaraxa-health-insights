interface Props {
  value: number; // 0-100
}

export function RiskGauge({ value }: Props) {
  const v = Math.max(0, Math.min(100, value));
  const color = v < 30 ? "#22c55e" : v < 60 ? "#f59e0b" : "#ef4444";
  const label = v < 30 ? "LOW" : v < 60 ? "MEDIUM" : "HIGH";

  // Semi-circle gauge using SVG
  const radius = 110;
  const circ = Math.PI * radius;
  const offset = circ - (v / 100) * circ;

  return (
    <div className="inline-flex flex-col items-center gap-3">
      {/* Percentage above gauge */}
      <div className="text-center">
        <div className="text-6xl font-bold tabular-nums" style={{ color }}>{v}<span className="text-2xl">%</span></div>
        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Risk Score</div>
      </div>

      {/* Gauge arc */}
      <svg width="280" height="170" viewBox="0 0 280 170" className="overflow-visible">
        <defs>
          <linearGradient id="gaugeBg" x1="0" x2="1">
            <stop offset="0" stopColor="#22c55e" />
            <stop offset="0.5" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* bg track */}
        <path d="M 30 150 A 110 110 0 0 1 250 150" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" strokeLinecap="round" />
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

      {/* Badge below gauge with 12px gap */}
      <span
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
        style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
      >
        <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        {label} RISK
      </span>
    </div>
  );
}
