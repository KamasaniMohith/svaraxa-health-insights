interface Props {
  value: number; // 0-100
}

export function RiskGauge({ value }: Props) {
  const v = Math.max(0, Math.min(100, value));
  const color = v < 30 ? "#4a7c59" : v < 60 ? "#c4820a" : "#c0392b";
  const label = v < 30 ? "LOW" : v < 60 ? "MEDIUM" : "HIGH";

  // Semi-circle gauge using SVG
  const radius = 110;
  const circ = Math.PI * radius;
  const offset = circ - (v / 100) * circ;

  return (
    <div className="inline-flex flex-col items-center gap-3">
      {/* Percentage above gauge */}
      <div className="text-center">
        <div className="text-6xl font-bold tabular-nums" style={{ color, fontFamily: "'Playfair Display', Georgia, serif" }}>{v}<span className="text-2xl">%</span></div>
        <div className="mt-1 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Risk Score</div>
      </div>

      {/* Gauge arc */}
      <svg width="280" height="170" viewBox="0 0 280 170" className="overflow-visible">
        <defs>
          <linearGradient id="gaugeBg" x1="0" x2="1">
            <stop offset="0" stopColor="#4a7c59" />
            <stop offset="0.5" stopColor="#c4820a" />
            <stop offset="1" stopColor="#c0392b" />
          </linearGradient>
        </defs>
        {/* bg track */}
        <path d="M 30 150 A 110 110 0 0 1 250 150" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="18" strokeLinecap="round" />
        {/* gradient track faint */}
        <path d="M 30 150 A 110 110 0 0 1 250 150" fill="none" stroke="url(#gaugeBg)" strokeOpacity="0.15" strokeWidth="18" strokeLinecap="round" />
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
        />
      </svg>

      {/* Badge below gauge */}
      <span
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
        style={{ 
          backgroundColor: v < 30 ? "rgba(74,124,89,0.12)" : v < 60 ? "rgba(196,130,10,0.12)" : "rgba(192,57,43,0.10)",
          color, 
          border: v < 30 ? "1px solid rgba(74,124,89,0.25)" : v < 60 ? "1px solid rgba(196,130,10,0.25)" : "1px solid rgba(192,57,43,0.22)"
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        {label} RISK
      </span>
    </div>
  );
}
