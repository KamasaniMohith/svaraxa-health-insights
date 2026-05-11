import { useEffect, useState } from "react";
import { Activity, Brain, Sparkles } from "lucide-react";

const steps = [
  { icon: Activity, text: "Analyzing health indicators..." },
  { icon: Brain, text: "Generating AI explanation..." },
  { icon: Sparkles, text: "Preparing recommendations..." },
];

export function LoadingScreen() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % steps.length), 1400);
    return () => clearInterval(t);
  }, []);
  const S = steps[i];
  const Icon = S.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--electric)] to-[var(--emerald)] opacity-30 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[var(--electric)] to-[var(--emerald)] opacity-60 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center ring-glow">
            <Icon className="h-8 w-8 text-[var(--electric)]" />
          </div>
        </div>
        <p key={i} className="mt-8 text-base font-medium animate-fade-in">{S.text}</p>
        <div className="mt-4 flex justify-center gap-1.5">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-1 w-8 rounded-full transition-colors ${idx === i ? "bg-[var(--electric)]" : "bg-white/10"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
