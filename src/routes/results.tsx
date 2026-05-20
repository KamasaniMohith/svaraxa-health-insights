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
              <AlertTriangle className="h-12 w-12" style={{ color: 'var(--danger)' }} />
              <div className="text-center">
                <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--text-primary)' }}>No Results Found</h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Please complete an assessment to view your results.</p>
              </div>
              <Button asChild className="mt-4 h-11 px-6 text-white border-0 font-semibold" style={{ background: 'var(--primary)' }}>
                <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Home</Link>
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
        return "#4a7c59";
      case "MEDIUM":
        return "#c4820a";
      case "HIGH":
        return "#c0392b";
      default:
        return "#4a7c59";
    }
  };

  const getFactorColor = (impact: string): string => {
    if (impact === "Major Impact") return "#c0392b";
    if (impact === "Moderate Impact") return "#c4820a";
    return "#4a7c59";
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

  return (
    <div className="bg-hero">
      <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--success)' }}>Analysis Complete</p>
              <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '400', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{result.disease} Risk Report</h1>
            </div>
            <span className="text-xs inline-flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--primary)' }} /> Generated by SVARAXA AI
            </span>
          </div>

          {/* TOP ROW: gauge + (health age, risk level) */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Gauge */}
            <div className="glass-strong rounded-lg p-8 flex flex-col items-center justify-center animate-fade-up min-h-[280px]">
              <RiskGauge value={score} />
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
                {result.disease} Risk
              </p>
            </div>

            {/* Right column: 2 stacked/side cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-strong rounded-lg p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  <TrendingUp className="h-3.5 w-3.5" /> Health Age
                </div>
                <div className="mt-4 text-5xl font-bold tabular-nums" style={{ fontFamily: "'Playfair Display', Georgia, serif", background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {result.health_age ?? "N/A"}
                </div>
                <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Your age: {result.actual_age}</div>
                <p className="mt-4 text-xs" style={{ color: 'var(--warning)' }}>
                  {result.health_age && result.actual_age && result.health_age > result.actual_age
                    ? "Your health is aging faster than expected."
                    : "Your health is in good condition for your age."}
                </p>
              </div>
              <div className="glass-strong rounded-lg p-6 animate-fade-up" style={{ animationDelay: "180ms" }}>
                <div className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--text-secondary)' }}>Risk Level</div>
                <div
                  className="mt-4 text-5xl font-bold tabular-nums"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: getRiskColor(result.risk_level) }}
                >
                  {result.risk_level}
                </div>
                <div className="mt-6 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />
                <p className="mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Model Confidence: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{result.confidence.toFixed(1)}%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Why this score */}
          <section className="mt-12">
            <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '400', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Why this score?</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Top contributors driving your risk score.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {result.top_factors.slice(0, 3).map((f, i) => (
                <div key={`${f.factor}-${i}`} className="glass rounded-lg p-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{getFriendlyFactorName(f.factor)}</div>
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full"
                      style={{
                        color: getFactorColor(f.impact),
                        backgroundColor: f.impact === "Major Impact" ? "rgba(192,57,43,0.10)" : f.impact === "Moderate Impact" ? "rgba(196,130,10,0.12)" : "rgba(74,124,89,0.12)",
                        border: f.impact === "Major Impact" ? "1px solid rgba(192,57,43,0.22)" : f.impact === "Moderate Impact" ? "1px solid rgba(196,130,10,0.25)" : "1px solid rgba(74,124,89,0.25)",
                      }}
                    >
                      {f.impact}
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-[1400ms] ease-out"
                      style={{
                        width: `${(f.score / maxFactorScore) * 85}%`,
                        background: getFactorColor(f.impact),
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
            <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '400', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Recommended Actions</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Evidence-based steps tailored to your profile.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {result.recommendations.map((rec, i) => {
                const icons = [Heart, Footprints, CalendarCheck, Stethoscope];
                const colors = ["#c0392b", "#4a7c59", "#c4820a", "#4a7c59"];
                const Icon = icons[i % icons.length];
                const color = colors[i % colors.length];
                return (
                  <div key={`${rec}-${i}`} className="glass rounded-lg p-5 flex gap-4 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                      style={{
                        backgroundColor: color === "#c0392b" ? "rgba(192,57,43,0.10)" : color === "#4a7c59" ? "rgba(74,124,89,0.12)" : "rgba(196,130,10,0.12)",
                        color: color,
                        borderColor: color === "#c0392b" ? "rgba(192,57,43,0.22)" : color === "#4a7c59" ? "rgba(74,124,89,0.25)" : "rgba(196,130,10,0.25)",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{rec}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            <Button
              variant="ghost"
              onClick={handleDownload}
              disabled={downloading}
              className="h-11 px-6 font-semibold"
              style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--text-secondary)' }}
            >
              <Download className="h-4 w-4" /> {downloading ? "Generating..." : "Download PDF"}
            </Button>
            <Button
              variant="ghost"
              onClick={handleSaveReport}
              disabled={isSaved}
              className="h-11 px-6 font-semibold disabled:opacity-60"
              style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--text-secondary)' }}
            >
              {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />} {isSaved ? "Saved" : "Save Report"}
            </Button>
            <Button
              asChild
              className="h-11 px-6 text-white border-0 font-semibold"
              style={{ background: 'var(--primary)' }}
            >
              <Link to="/"><RefreshCw className="h-4 w-4" /> Check Another</Link>
            </Button>
          </div>

          {/* Red disclaimer */}
          <div className="mt-8 flex items-start gap-3 rounded-lg border p-5" style={{ borderColor: 'rgba(192,57,43,0.22)', backgroundColor: 'rgba(192,57,43,0.05)' }}>
            <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: 'var(--danger)' }} />
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              <span className="font-semibold" style={{ color: 'var(--danger)' }}>⚠️ Not a medical diagnosis.</span>{" "}
              This is for awareness only. Always consult a licensed healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
