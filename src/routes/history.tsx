import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/tanstack-start";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Calendar } from "lucide-react";
import type { PredictionResult } from "@/lib/api";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

interface SavedAssessment extends PredictionResult {
  savedAt: string;
}

function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState<SavedAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      window.location.href = "/";
      return;
    }

    setIsLoading(false);
    const savedHistory = JSON.parse(localStorage.getItem("svaraxa_history") || "[]") as SavedAssessment[];
    setHistory(savedHistory);
  }, [user, isLoaded]);

  const getRiskColor = (level: string): string => {
    switch (level) {
      case "LOW":
        return "var(--emerald)";
      case "MEDIUM":
        return "var(--warning)";
      case "HIGH":
        return "var(--danger)";
      default:
        return "var(--electric)";
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all assessment history? This action cannot be undone.")) {
      localStorage.removeItem("svaraxa_history");
      setHistory([]);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getRiskBadgeClass = (level: string): string => {
    switch (level) {
      case "LOW":
        return "bg-[var(--emerald)]/20 text-[var(--emerald)] border-[var(--emerald)]/40";
      case "MEDIUM":
        return "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/40";
      case "HIGH":
        return "bg-[var(--danger)]/20 text-[var(--danger)] border-[var(--danger)]/40";
      default:
        return "bg-[var(--electric)]/20 text-[var(--electric)] border-[var(--electric)]/40";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-hero">
        <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-hero">
      <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--electric)]">Your assessments</p>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold">My Health History</h1>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearHistory}
                className="h-10 px-4 border-[var(--danger)]/40 text-[var(--danger)] bg-[var(--danger)]/5 hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Clear All History
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="mt-12">
              <div className="flex flex-col items-center justify-center gap-6 py-20 rounded-2xl border border-white/5 bg-white/2.5">
                <AlertTriangle className="h-12 w-12 text-[var(--warning)]" />
                <div className="text-center">
                  <h2 className="text-2xl font-bold">No saved assessments yet</h2>
                  <p className="mt-2 text-muted-foreground">Complete an assessment to save your results.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {history.map((assessment, index) => (
                <div
                  key={`${assessment.savedAt}-${index}`}
                  className="glass rounded-xl p-6 flex flex-col gap-4 animate-fade-up hover:bg-white/7.5 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Disease Title and Risk Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold capitalize">{assessment.disease}</h3>
                    <span
                      className={`text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap border ${getRiskBadgeClass(assessment.risk_level)}`}
                    >
                      {assessment.risk_level}
                    </span>
                  </div>

                  {/* Risk Score */}
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Risk Score</p>
                    <p className="mt-2 text-3xl font-bold text-gradient">{assessment.risk_score.toFixed(1)}</p>
                  </div>

                  {/* Recommendations Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                      {assessment.recommendations.length}
                    </span>
                    Recommendations
                  </div>

                  {/* Saved Date */}
                  <div className="border-t border-white/5 pt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(assessment.savedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info banner */}
          <div className="mt-12 flex items-start gap-3 rounded-xl border border-[var(--electric)]/40 bg-[var(--electric)]/10 p-5">
            <AlertTriangle className="h-5 w-5 text-[var(--electric)] mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/90">
              <span className="font-semibold text-[var(--electric)]">ℹ️ Your assessment history</span> is stored locally on this device. Assessments are not synced across devices. Always consult a licensed healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
