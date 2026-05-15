import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "@/components/RiskGauge";
import {
  Heart, Footprints, CalendarCheck, Stethoscope, Download, RefreshCw,
  AlertTriangle, TrendingUp, Sparkles, ArrowLeft, Bookmark, BookmarkCheck, Check,
} from "lucide-react";
import { getResult } from "@/lib/store";
import { generatePDF } from "@/lib/generatePDF";
import { useUser, useClerk } from "@clerk/tanstack-start";
import { toast } from "sonner";
import type { PredictionResult } from "@/lib/api";

export const Route = createFileRoute("/results")({
  validateSearch: (s: Record<string, unknown>) => ({
    disease: (s.disease as string) || "heart",
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { disease } = Route.useSearch();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [result, setResultState] = useState<PredictionResult | null>(null);
  const [score, setScore] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const data = getResult();
    setResultState(data);
  }, []);

  useEffect(() => {
    if (!result) return;
    let raf: number | null = null;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 3000);
      setScore(Math.round(result.risk_score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [result]);

  if (!result) {
    return (
      <div className="bg-hero">
        <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
            <div className="flex flex-col items-center justify-center gap-6 py-20">
              <AlertTriangle className="h-12 w-12 text-[var(--warning)]" />
              <div className="text-center">
                <h1 className="text-2xl font-bold">No Results Found</h1>
                <p className="mt-2 text-muted-foreground">Please complete an assessment to view your results.</p>
              </div>
              <Button asChild className="bg-gradient-to-r from-[var(--electric)] to-[var(--emerald)] hover:opacity-95 text-white border-0">
                <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string): string => {
    switch (level) {
      case "LOW":
        return "#22c55e";
      case "MEDIUM":
        return "#f59e0b";
      case "HIGH":
        return "#ef4444";
      default:
        return "#7c6af7";
    }
  };

  const getFactorColor = (impact: string): string => {
    if (impact === "Major Impact") return "#ef4444";
    if (impact === "Moderate Impact") return "#f59e0b";
    return "#f59e0b";
  };

  const factorNames: Record<string, string> = {
    "Ca": "Blocked Vessels",
    "Thal": "Thalassemia",
    "Cp": "Chest Pain Type",
    "Trestbps": "Blood Pressure",
    "Chol": "Cholesterol",
    "Thalach": "Max Heart Rate",
    "Oldpeak": "ST Depression",
    "Exang": "Exercise Angina",
    "Age": "Age",
    "Bmi": "Body Mass Index",
    "Glucose": "Blood Glucose",
    "Insulin": "Insulin Level",
    "Pregnancies": "Pregnancies",
    "Blood Pressure": "Blood Pressure",
    "Diabetes Pedigree": "Family History Score",
    "Skin Thickness": "Skin Thickness",
  };

  const getFriendlyFactorName = (factor: string): string => {
    return factorNames[factor] || factor;
  };

  const getNormalizedFactorWidth = (): number => {
    const scores = result.top_factors.map((f) => f.score);
    return Math.max(...scores);
  };

  const maxFactorScore = getNormalizedFactorWidth();

  const handleDownload = async () => {
    setDownloading(true);
    await generatePDF(result, {});
    setDownloading(false);
  };

  const handleSaveReport = () => {
    if (!user) {
      toast.error("Sign in to save your reports");
      openSignIn();
      return;
    }

    if (!result) return;

    const history = JSON.parse(localStorage.getItem("svaraxa_history") || "[]") as Array<PredictionResult & { savedAt: string }>;
    const newEntry = {
      ...result,
      savedAt: new Date().toISOString(),
    };
    history.push(newEntry);
    localStorage.setItem("svaraxa_history", JSON.stringify(history));
    
    setIsSaved(true);
    toast.success("Report Saved!", {
      description: "View it anytime in your History",
      duration: 3000,
      icon: <Check className="h-5 w-5 text-[#22c55e]" />,
    });
  };
      duration: 3000,
      icon: <Check className="h-5 w-5 text-[#22c55e]" />,
    }.stringify(history));
    toast.success("Assessment saved to history!");
  };

  return (
    <div className="bg-hero">
      <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#22c55e] font-500">Analysis Complete</p>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold">{result.disease} Risk Report</h1>
            </div>
            <span className="text-xs text-[#94a3b8] inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#7c6af7]" /> Generated by SVARAXA Explainable AI
            </span>
          </div>

          {/* TOP ROW: gauge + (health age, risk level) */}
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {/* Gauge */}
            <div className="glass-strong rounded-2xl p-8 flex flex-col items-center justify-center animate-fade-up min-h-[280px]">
              <RiskGauge value={score} />
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-[#94a3b8] font-500">
                {result.disease} Risk
              </p>
            </div>

            {/* Right column: 2 stacked/side cards */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="glass-strong rounded-2xl p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#94a3b8] font-500">
                  <TrendingUp className="h-3.5 w-3.5" /> Health Age
                </div>
                <div className="mt-4 text-6xl font-bold tabular-nums text-gradient">
                  {result.health_age ?? "N/A"}
                </div>
                <div className="mt-2 text-sm text-[#94a3b8]">Your age: {result.actual_age}</div>
                <p className="mt-4 text-xs text-[#f59e0b]">
                  {result.health_age && result.actual_age && result.health_age > result.actual_age
                    ? "Your health is aging faster than expected."
                    : "Your health is in good condition for your age."}
                </p>
              </div>
              <div className="glass-strong rounded-2xl p-6 animate-fade-up" style={{ animationDelay: "180ms" }}>
                <div className="text-xs uppercase tracking-[0.18em] text-[#94a3b8] font-500">Risk Level</div>
                <div
                  className="mt-4 text-5xl font-bold tabular-nums"
                  style={{ color: getRiskColor(result.risk_level) }}
                >
                  {result.risk_level}
                </div>
                <div className="mt-6 h-px bg-[rgba(255,255,255,0.05)]" />
                <p className="mt-4 text-xs text-[#94a3b8]">
                  Model Confidence: <span className="font-semibold text-[#f8f8ff]">{result.confidence.toFixed(1)}%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Why this score */}
          <section className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold">Why this score?</h2>
            <p className="text-sm text-[#94a3b8]">Top contributors driving your risk score.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {result.top_factors.slice(0, 3).map((f, i) => (
                <div key={`${f.factor}-${i}`} className="glass rounded-xl p-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{getFriendlyFactorName(f.factor)}</div>
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: getFactorColor(f.impact),
                        backgroundColor: `${getFactorColor(f.impact)}18`,
                        border: `1px solid ${getFactorColor(f.impact)}40`,
                      }}
                    >
                      {f.impact}
                    </span>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-[1400ms] ease-out"
                      style={{
                        width: `${(f.score / maxFactorScore) * 85}%`,
                        background: `linear-gradient(90deg, ${getFactorColor(f.impact)}55, ${getFactorColor(f.impact)})`,
                        boxShadow: `0 0 14px ${getFactorColor(f.impact)}`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-right text-xs font-semibold tabular-nums" style={{ color: getFactorColor(f.impact) }}>
                    {f.score.toFixed(3)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Actions */}
          <section className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold">Recommended Actions</h2>
            <p className="text-sm text-[#94a3b8]">Evidence-based steps tailored to your profile.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {result.recommendations.map((rec, i) => {
                const icons = [Heart, Footprints, CalendarCheck, Stethoscope];
                const colors = ["#ef4444", "#22c55e", "#7c6af7", "#f59e0b"];
                const Icon = icons[i % icons.length];
                const color = colors[i % colors.length];
                return (
                  <div key={`${rec}-${i}`} className="glass rounded-xl p-5 flex gap-4 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${color}18`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="mt-12 grid sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={downloading}
              className="h-11 px-6 border-[#7c6af7]/40 text-[#7c6af7] bg-[#7c6af7]/5 hover:bg-[#7c6af7]/10 hover:text-[#7c6af7]"
            >
              <Download /> {downloading ? "Generating PDF..." : "Download PDF Report"}
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveReport}
              disabled={isSaved}
              className="h-11 px-6 border-[#7c6af7]/40 text-[#7c6af7] bg-[#7c6af7]/5 hover:bg-[#7c6af7]/10 hover:text-[#7c6af7] disabled:opacity-60 disabled:cursor-default"
            >
              {isSaved ? <BookmarkCheck /> : <Bookmark />} {isSaved ? "Report Saved" : "Save Report"}
            </Button>
            <Button
              asChild
              className="h-11 px-6 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] hover:opacity-95 text-white border-0 shadow-lg shadow-[#7c6af7]/30"
            >
              <Link to="/"><RefreshCw /> Check Another Disease</Link>
            </Button>
          </div>

          {/* Red disclaimer */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#ef4444]/40 bg-[#ef4444]/10 p-5">
            <AlertTriangle className="h-5 w-5 text-[#ef4444] mt-0.5 shrink-0" />
            <p className="text-sm text-[#f8f8ff]/90">
              <span className="font-semibold text-[#ef4444]">⚠️ This is NOT a medical diagnosis.</span>{" "}
              Results are for awareness only. Always consult a licensed healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
