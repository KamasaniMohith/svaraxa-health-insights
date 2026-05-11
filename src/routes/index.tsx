import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Heart, Droplet, Ribbon, ArrowRight, ClipboardList, Brain, FileText, Activity,
  ShieldCheck, Sparkles, Lock, Watch, MessageSquareHeart, Stethoscope, AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const diseases = [
  {
    slug: "heart",
    name: "Heart Disease",
    icon: Heart,
    accent: "var(--danger)",
    desc: "Cardiovascular risk analysis using 9 clinical indicators including BP, cholesterol, and ECG-derived metrics.",
  },
  {
    slug: "diabetes",
    name: "Diabetes",
    icon: Droplet,
    accent: "var(--electric)",
    desc: "Type-2 diabetes risk profile based on glucose, BMI, insulin response, and hereditary patterns.",
  },
  {
    slug: "breast-cancer",
    name: "Breast Cancer",
    icon: Ribbon,
    accent: "var(--emerald)",
    desc: "Tumor characteristic analysis from biopsy measurements to estimate malignancy probability.",
  },
];

const steps = [
  { icon: ClipboardList, title: "Enter Data", desc: "Answer a short clinical questionnaire." },
  { icon: Brain, title: "AI Analysis", desc: "Our model evaluates dozens of health signals." },
  { icon: FileText, title: "Get Explanation", desc: "See which factors drive your risk and why." },
  { icon: Activity, title: "Take Action", desc: "Get personalized, evidence-based next steps." },
];

const stats = [
  { value: "3", label: "Diseases Covered" },
  { value: "100%", label: "Explainable AI" },
  { value: "~2 min", label: "Average Assessment" },
  { value: "14,238", label: "Assessments Done" },
];

const soon = [
  { icon: Activity, title: "ECG Upload", desc: "Upload a 12-lead ECG and get instant rhythm analysis." },
  { icon: Watch, title: "Wearables Sync", desc: "Continuous risk tracking from Apple Watch & Fitbit." },
  { icon: MessageSquareHeart, title: "AI Health Chat", desc: "Conversational triage with an AI medical assistant." },
];

function Landing() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_85%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="mx-auto max-w-4xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs tracking-wide text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[var(--emerald)]" />
              Explainable AI · Clinically grounded
            </span>
            <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05]">
              Know Your <span className="text-gradient">Health Risk</span>
              <br /> Before It Becomes a Crisis
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              SVARAXA combines clinical-grade models with explainable AI to surface
              early warning signs across heart disease, diabetes, and breast cancer —
              in under two minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                asChild
                className="h-12 px-7 text-base bg-gradient-to-r from-[var(--electric)] to-[var(--emerald)] hover:opacity-95 text-white border-0 shadow-lg shadow-[var(--electric)]/30"
              >
                <a href="#diseases">
                  Start Free Assessment <ArrowRight className="ml-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-7 text-base border-white/15 bg-white/5 hover:bg-white/10">
                <a href="#how">How it works</a>
              </Button>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--emerald)]" /> Private & encrypted</span>
              <span className="hidden sm:inline-flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-[var(--electric)]" /> Reviewed by clinicians</span>
            </div>
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <section id="diseases" className="relative mx-auto max-w-7xl px-4 sm:px-6 -mt-12 md:-mt-20">
        <div className="grid gap-5 md:grid-cols-3">
          {diseases.map((d, i) => {
            const Icon = d.icon;
            return (
              <Link
                key={d.slug}
                to="/assess/$disease"
                params={{ disease: d.slug }}
                className="group glass-strong rounded-2xl p-6 transition-all hover:-translate-y-1 hover:ring-glow animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mb-5"
                  style={{ backgroundColor: `color-mix(in oklab, ${d.accent} 18%, transparent)`, color: d.accent, border: `1px solid color-mix(in oklab, ${d.accent} 35%, transparent)` }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{d.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground min-h-[60px]">{d.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--electric)] group-hover:gap-2.5 transition-all">
                  Assess Risk <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 mt-28">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
          <p className="mt-3 text-muted-foreground">Four steps from data to action.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="glass rounded-2xl p-6 relative animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="absolute right-5 top-5 text-xs font-bold text-muted-foreground/40">0{i + 1}</div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--electric)]/20 to-[var(--emerald)]/20 border border-white/10 text-[var(--electric)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-semibold">{s.title}</h4>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="glass-strong rounded-2xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-y-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMING SOON */}
      <section id="soon" className="mx-auto max-w-7xl px-4 sm:px-6 mt-28">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Coming soon</h2>
            <p className="mt-2 text-muted-foreground">The next chapter of preventive AI care.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--emerald)]">In development</span>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {soon.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative glass rounded-2xl p-6 overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-background/30" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground"><Lock className="h-3 w-3" /> Locked</span>
                  </div>
                  <h4 className="mt-4 font-semibold">{s.title}</h4>
                  <p className="mt-1.5 text-sm text-muted-foreground/80">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-5">
          <AlertTriangle className="h-5 w-5 text-[var(--warning)] mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Medical Disclaimer:</strong> SVARAXA is an informational tool and does not provide medical diagnosis,
            treatment, or replace professional medical advice. Always consult a licensed healthcare provider regarding any medical condition.
          </p>
        </div>
      </section>
    </div>
  );
}
