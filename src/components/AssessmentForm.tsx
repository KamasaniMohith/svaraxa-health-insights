import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ArrowLeft, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";

export type FieldType = "slider" | "select" | "toggle" | "buttons" | "number";

export interface Field {
  key: string;
  label: string;
  helper?: string;
  type: FieldType;
  min?: number; max?: number; step?: number;
  defaultValue?: number | boolean | string;
  options?: { value: string; label: string }[];
  unit?: string;
  showIf?: (values: Record<string, any>) => boolean;
}

export interface AssessmentConfig {
  name: string;
  slug: string;
  steps: { title: string; fields: Field[] }[];
}

export function AssessmentForm({ config }: { config: AssessmentConfig }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    config.steps.forEach((s) => s.fields.forEach((f) => (init[f.key] = f.defaultValue)));
    return init;
  });

  const totalSteps = config.steps.length + 1; // + review
  const isReview = step === config.steps.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const current = config.steps[step];

  const allFields = useMemo(
    () => config.steps.flatMap((s) => s.fields).filter((f) => !f.showIf || f.showIf(values)),
    [config, values]
  );

  const update = (k: string, v: any) => setValues((p) => ({ ...p, [k]: v }));

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      navigate({ to: "/results", search: { disease: config.slug } as any });
    }, 2800);
  };

  return (
    <div className="relative">
      {loading && <LoadingScreen />}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 flex items-baseline justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">{config.name} Assessment</h1>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </span>
        </div>

        <div className="mt-4 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--electric)] to-[var(--emerald)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div key={step} className="mt-8 glass-strong rounded-2xl p-6 sm:p-8 animate-fade-up">
          {!isReview ? (
            <>
              <h2 className="text-lg font-semibold">{current.title}</h2>
              <p className="text-sm text-muted-foreground">
                Provide the details below. Helper text shows healthy ranges.
              </p>
              <div className="mt-7 space-y-7">
                {current.fields
                  .filter((f) => !f.showIf || f.showIf(values))
                  .map((f) => (
                    <FieldRenderer
                      key={f.key}
                      field={f}
                      value={values[f.key]}
                      onChange={(v) => update(f.key, v)}
                    />
                  ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--emerald)]" /> Review your data
              </h2>
              <p className="text-sm text-muted-foreground">
                Confirm the values below, then run the analysis.
              </p>
              <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {allFields.map((f) => (
                  <div key={f.key} className="flex justify-between gap-3 border-b border-white/5 pb-2">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="font-medium text-right">{formatValue(values[f.key], f)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground rounded-lg border border-[var(--warning)]/25 bg-[var(--warning)]/5 p-3">
                <AlertTriangle className="h-4 w-4 text-[var(--warning)] shrink-0 mt-0.5" />
                Predictions are not medical diagnoses. Always consult a clinician.
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="border-white/10 bg-white/5"
          >
            <ArrowLeft /> Back
          </Button>
          {isReview ? (
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={submit}
                className="bg-gradient-to-r from-[var(--electric)] to-[var(--emerald)] hover:opacity-95 text-white border-0 shadow-lg shadow-[var(--electric)]/30"
              >
                <Sparkles /> Analyze My Health Risk
              </Button>
              <p className="text-[11px] text-muted-foreground max-w-xs text-right">
                Informational use only — not a diagnosis.
              </p>
            </div>
          ) : (
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="bg-gradient-to-r from-[var(--electric)] to-[var(--emerald)] hover:opacity-95 text-white border-0"
            >
              Next <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatValue(v: any, f: Field) {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (f.options) return f.options.find((o) => o.value === v)?.label ?? String(v);
  return f.unit ? `${v} ${f.unit}` : String(v);
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Label className="text-sm font-medium">{field.label}</Label>
        {field.type === "slider" && (
          <span className="text-sm tabular-nums font-semibold text-[var(--electric)]">
            {value}{field.unit ? ` ${field.unit}` : ""}
          </span>
        )}
      </div>
      <div className="mt-3">
        {field.type === "slider" && (
          <Slider
            min={field.min}
            max={field.max}
            step={field.step}
            value={[Number(value)]}
            onValueChange={(v) => onChange(v[0])}
          />
        )}
        {field.type === "number" && (
          <Input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step ?? "any"}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="bg-white/5 border-white/10"
          />
        )}
        {field.type === "select" && (
          <Select value={String(value)} onValueChange={onChange}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options!.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {field.type === "buttons" && (
          <div className="grid grid-cols-2 gap-2">
            {field.options!.map((o) => {
              const active = String(value) === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => onChange(o.value)}
                  className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                    active
                      ? "border-[var(--electric)] bg-[var(--electric)]/15 text-[var(--electric)] shadow-[0_0_18px_-4px_var(--electric)]"
                      : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        )}
        {field.type === "toggle" && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: true, l: "Yes" },
              { v: false, l: "No" },
            ].map((o) => {
              const active = !!value === o.v;
              return (
                <button
                  key={o.l}
                  type="button"
                  onClick={() => onChange(o.v)}
                  className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                    active
                      ? "border-[var(--emerald)] bg-[var(--emerald)]/15 text-[var(--emerald)] shadow-[0_0_18px_-4px_var(--emerald)]"
                      : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground"
                  }`}
                >
                  {o.l}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {field.helper && <p className="mt-2 text-xs text-muted-foreground">{field.helper}</p>}
    </div>
  );
}
