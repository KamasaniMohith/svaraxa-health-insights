import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const messages = [
  "Analyzing health indicators...",
  "Running AI prediction models...",
  "Generating explainability report...",
  "Preparing personalized recommendations...",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setMessageIndex((p) => (p + 1) % messages.length), 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="text-center">
        <div className="relative mx-auto h-32 w-32">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-[var(--electric)] opacity-20 animate-pulse" />
          {/* Middle pulsing ring */}
          <div className="absolute inset-3 rounded-full bg-[var(--electric)] opacity-30 animate-pulse" style={{ animationDelay: "0.2s" }} />
          {/* Inner pulsing ring */}
          <div className="absolute inset-6 rounded-full bg-[var(--electric)] opacity-40 animate-pulse" style={{ animationDelay: "0.4s" }} />
          {/* Center circle with icon */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--electric)] to-[var(--emerald)] flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>
        <p key={messageIndex} className="mt-8 text-base font-medium text-[var(--electric)] animate-fade-in">
          {messages[messageIndex]}
        </p>
        <div className="mt-6 flex justify-center gap-1.5">
          {messages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                idx === messageIndex ? "bg-[var(--electric)] w-6" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
