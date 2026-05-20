import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
    to: "/assess/heart-disease" as const,
    name: "Heart Disease",
    icon: Heart,
    accent: "var(--danger)",
    desc: "Cardiovascular risk analysis using 9 clinical indicators including BP, cholesterol, and ECG-derived metrics.",
  },
  {
    to: "/assess/diabetes" as const,
    name: "Diabetes",
    icon: Droplet,
    accent: "var(--electric)",
    desc: "Type-2 diabetes risk profile based on glucose, BMI, insulin response, and hereditary patterns.",
  },
  {
    to: "/assess/$disease" as const,
    params: { disease: "breast-cancer" },
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

function AnimatedCounter({ targetValue, label }: { targetValue: number; label: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500; // milliseconds
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(targetValue * progress));

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isVisible, targetValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{count.toLocaleString()}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

function Landing() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_85%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="mx-auto max-w-4xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} />
              Explainable AI · Clinically grounded
            </span>
            <div className="flex justify-center mb-8">
              <img 
                src="/svaraxa-logo.png"
                alt="SVARAXA"
                style={{ 
                  height: '72px', 
                  width: '72px',
                  objectFit: 'contain',
                  opacity: 0.85
                }}
              />
            </div>
            <h1 className="mt-8 leading-[1.1]" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '400', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Know Your <span style={{ fontStyle: 'italic', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Health Risk</span>
              <br /> Before It Becomes a Crisis
            </h1>
            <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', fontWeight: '300' }}>
              SVARAXA combines clinical-grade models with explainable AI to surface
              early warning signs across heart disease, diabetes, and breast cancer —
              in under two minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 text-base font-semibold text-white border-0"
                style={{ background: 'var(--primary)', borderRadius: '8px' }}
              >
                <a href="#diseases">
                  Start Free Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="ghost" asChild className="h-12 px-8 text-base font-medium" style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--text-secondary)' }}>
                <a href="#how">How it works</a>
              </Button>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} /> Private & encrypted</span>
              <span className="hidden sm:inline-flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5" style={{ color: 'var(--primary)' }} /> Reviewed by clinicians</span>
            </div>
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <section id="diseases" className="relative mx-auto max-w-7xl px-4 sm:px-6 -mt-12 md:-mt-20" style={{ scrollMarginTop: "80px" }}>
        <div className="grid gap-6 md:grid-cols-3">
          {diseases.map((d, i) => {
            const Icon = d.icon;
            const accentColor = d.name === "Heart Disease" ? "var(--danger)" : d.name === "Diabetes" ? "var(--warning)" : "var(--success)";
            return (
              <Link
                key={d.name}
                to={d.to}
                params={(d as any).params}
                className="group glass-strong rounded-lg p-6 transition-all hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg mb-6"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--text-primary)' }}>{d.name}</h3>
                <p className="mt-2 text-sm min-h-[60px]" style={{ color: 'var(--text-secondary)' }}>{d.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-all" style={{ color: 'var(--primary)' }}>
                  Assess Risk <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 mt-28" style={{ scrollMarginTop: "80px" }}>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '400', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>How it works</h2>
          <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Four steps from data to action.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="glass rounded-lg p-6 relative animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="absolute right-6 top-6 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>0{i + 1}</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ backgroundColor: 'rgba(74, 124, 89, 0.15)', borderColor: 'rgba(74, 124, 89, 0.3)', color: 'var(--accent)' }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</h4>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="glass-strong rounded-lg px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-y-8">
          {stats.map((s) => (
            s.label === "Assessments Done" ? (
              <AnimatedCounter key={s.label} targetValue={parseInt(s.value.replace(/,/g, ""))} label={s.label} />
            ) : (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* COMING SOON */}
      <section id="soon" className="mx-auto max-w-7xl px-4 sm:px-6 mt-28" style={{ scrollMarginTop: "80px" }}>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '400', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Coming soon</h2>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>The next chapter of preventive AI care.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--success)' }}>In development</span>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {soon.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative glass rounded-lg p-6 overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[2px]" style={{ backgroundColor: 'rgba(250, 249, 246, 0.3)' }} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderColor: 'rgba(0,0,0,0.08)', color: 'var(--text-secondary)' }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}><Lock className="h-3 w-3" /> Locked</span>
                  </div>
                  <h4 className="mt-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</h4>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="flex items-start gap-3 rounded-xl border p-5" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: 'var(--warning)' }} />
          <p className="text-sm">
            <strong style={{ color: 'var(--text-primary)' }}>Medical Disclaimer:</strong> <span style={{ color: 'var(--text-secondary)' }}>SVARAXA is an informational tool and does not provide medical diagnosis, treatment, or replace professional medical advice. Always consult a licensed healthcare provider regarding any medical condition.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
