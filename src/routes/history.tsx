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
        return "#22c55e";
      case "MEDIUM":
        return "#f59e0b";
      case "HIGH":
        return "#ef4444";
      default:
        return "#7c6af7";
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
        return "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/40";
      case "MEDIUM":
        return "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40";
      case "HIGH":
        return "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40";
      default:
        return "bg-[#7c6af7]/20 text-[#7c6af7] border-[#7c6af7]/40";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-hero">
        <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-[#94a3b8]">Loading...</p>
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
              <p className="text-xs uppercase tracking-[0.2em] text-[#7c6af7] font-500">Your assessments</p>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold">My Health History</h1>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearHistory}
                className="h-10 px-4 border-[#ef4444]/40 text-[#ef4444] bg-[#ef4444]/5 hover:bg-[#ef4444]/10 hover:text-[#ef4444]"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Clear All History
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="mt-12">
              <div className="flex flex-col items-center justify-center gap-6 py-20 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.025)]">
                <AlertTriangle className="h-12 w-12 text-[#f59e0b]" />
                <div className="text-center">
                  <h2 className="text-2xl font-bold">No saved assessments yet</h2>
                  <p className="mt-2 text-[#94a3b8]">Complete an assessment to save your results.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {history.map((assessment, index) => (
                <div
                  key={`${assessment.savedAt}-${index}`}
                  className="glass rounded-xl p-6 flex flex-col gap-4 animate-fade-up hover:bg-[rgba(255,255,255,0.08)] transition-colors"
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
                  <div className="border-t border-[rgba(255,255,255,0.05)] pt-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8] font-500">Risk Score</p>
                    <p className="mt-2 text-3xl font-bold text-gradient">{assessment.risk_score.toFixed(1)}</p>
                  </div>

                  {/* Recommendations Count */}
                  <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)]">
                      {assessment.recommendations.length}
                    </span>
                    Recommendations
                  </div>

                  {/* Saved Date */}
                  <div className="border-t border-[rgba(255,255,255,0.05)] pt-3 flex items-center gap-2 text-xs text-[#94a3b8]">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(assessment.savedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info banner */}
          <div className="mt-12 flex items-start gap-3 rounded-xl border border-[#7c6af7]/40 bg-[#7c6af7]/10 p-5">
            <AlertTriangle className="h-5 w-5 text-[#7c6af7] mt-0.5 shrink-0" />
            <p className="text-sm text-[#f8f8ff]/90">
              <span className="font-semibold text-[#7c6af7]">ℹ️ Your assessment history</span> is stored locally on this device. Assessments are not synced across devices. Always consult a licensed healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
