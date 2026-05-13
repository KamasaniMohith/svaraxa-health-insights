import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ArrowLeft, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import { predictBreastCancer } from "@/lib/api";
import { setResult } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/assess/$disease")({
  component: AssessPage,
});

type FieldType = "slider" | "select" | "toggle" | "number";
interface Field {
  key: string;
  label: string;
  helper?: string;
  type: FieldType;
  min?: number; max?: number; step?: number; defaultValue?: number | boolean | string;
  options?: { value: string; label: string }[];
  unit?: string;
}

const HEART: { title: string; fields: Field[] }[] = [
  {
    title: "About you",
    fields: [
      { key: "age", label: "Age", type: "slider", min: 18, max: 100, step: 1, defaultValue: 45, unit: "yrs", helper: "Adults 18-100" },
      { key: "gender", label: "Gender", type: "select", options: [{ value: "m", label: "Male" }, { value: "f", label: "Female" }], defaultValue: "m" },
    ],
  },
  {
    title: "Symptoms",
    fields: [
      { key: "cp", label: "Chest Pain Type", type: "select", options: [
        { value: "ta", label: "Typical angina" },
        { value: "aa", label: "Atypical angina" },
        { value: "nap", label: "Non-anginal pain" },
        { value: "asy", label: "Asymptomatic" },
      ], defaultValue: "nap" },
      { key: "exang", label: "Exercise-induced Angina", type: "toggle", defaultValue: false, helper: "Pain during exercise" },
    ],
  },
  {
    title: "Vitals",
    fields: [
      { key: "bp", label: "Resting Blood Pressure", type: "slider", min: 80, max: 200, step: 1, defaultValue: 120, unit: "mmHg", helper: "Normal: 90-120 mmHg" },
      { key: "chol", label: "Cholesterol", type: "slider", min: 100, max: 400, step: 1, defaultValue: 200, unit: "mg/dL", helper: "Normal: < 200 mg/dL" },
      { key: "fbs", label: "Fasting Blood Sugar > 120 mg/dL", type: "toggle", defaultValue: false, helper: "Elevated fasting sugar" },
    ],
  },
  {
    title: "Cardiac response",
    fields: [
      { key: "thalach", label: "Max Heart Rate Achieved", type: "slider", min: 60, max: 220, step: 1, defaultValue: 150, unit: "bpm", helper: "Typical peak: 150-180 bpm" },
      { key: "oldpeak", label: "ST Depression (oldpeak)", type: "number", defaultValue: 1.0, helper: "ECG ST depression in mV (0-6.2)" },
    ],
  },
];

const DIABETES: { title: string; fields: Field[] }[] = [
  {
    title: "Background",
    fields: [
      { key: "pregnancies", label: "Pregnancies", type: "number", defaultValue: 0, helper: "Number of pregnancies (0 if N/A)" },
      { key: "age", label: "Age", type: "slider", min: 18, max: 100, step: 1, defaultValue: 35, unit: "yrs" },
    ],
  },
  {
    title: "Blood metrics",
    fields: [
      { key: "glucose", label: "Glucose (2-hr OGTT)", type: "slider", min: 50, max: 250, step: 1, defaultValue: 110, unit: "mg/dL", helper: "Normal: < 140 mg/dL" },
      { key: "bp", label: "Diastolic Blood Pressure", type: "slider", min: 40, max: 130, step: 1, defaultValue: 72, unit: "mmHg", helper: "Normal: 60-80 mmHg" },
      { key: "insulin", label: "Insulin (2-hr serum)", type: "number", defaultValue: 80, helper: "Normal: 16-166 µU/mL" },
    ],
  },
  {
    title: "Body composition",
    fields: [
      { key: "bmi", label: "BMI", type: "slider", min: 12, max: 60, step: 0.1, defaultValue: 25, unit: "kg/m²", helper: "Healthy: 18.5-24.9" },
      { key: "skin", label: "Skin Thickness (triceps)", type: "number", defaultValue: 20, helper: "Normal: 10-50 mm" },
    ],
  },
  {
    title: "Heredity",
    fields: [
      { key: "dpf", label: "Diabetes Pedigree Function", type: "number", defaultValue: 0.4, helper: "Family history score (0.08-2.5)" },
    ],
  },
];

const BREAST: { title: string; fields: Field[] }[] = [
  {
    title: "Tumor Characteristics",
    fields: [
      { key: "tumorSize", label: "Tumor Size", type: "slider", min: 1, max: 50, step: 0.5, defaultValue: 15, unit: "mm", helper: "Benign typically < 20mm" },
      { key: "textureIrregularity", label: "Texture Irregularity", type: "slider", min: 1, max: 10, step: 0.5, defaultValue: 5, unit: "scale 1-10", helper: "Smoother (1) to Irregular (10)" },
    ],
  },
  {
    title: "Cell Characteristics",
    fields: [
      { key: "boundarySmoothness", label: "Boundary Smoothness", type: "slider", min: 1, max: 10, step: 0.5, defaultValue: 5, unit: "scale 1-10", helper: "Smooth (1) to Irregular (10)" },
      { key: "cellUniformity", label: "Cell Uniformity", type: "slider", min: 1, max: 10, step: 0.5, defaultValue: 5, unit: "scale 1-10", helper: "Uniform (1) to Varied (10)" },
    ],
  },
  {
    title: "Review",
    fields: [],
  },
];

const SCHEMAS: Record<string, { name: string; steps: { title: string; fields: Field[] }[] }> = {
  "heart": { name: "Heart Disease", steps: HEART },
  "diabetes": { name: "Diabetes", steps: DIABETES },
  "breast-cancer": { name: "Breast Cancer", steps: BREAST },
};

function AssessPage() {
  const { disease } = Route.useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[disease];
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    if (!schema) return init;
    schema.steps.forEach((s) => s.fields.forEach((f) => (init[f.key] = f.defaultValue)));
    return init;
  });

  if (!schema) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Unknown assessment</h1>
        <p className="mt-3 text-muted-foreground">Choose one of our supported assessments.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </div>
    );
  }

  const totalSteps = schema.steps.length + 1; // include review
  const isReview = step === schema.steps.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const current = schema.steps[step];

  const allFields = useMemo(() => schema.steps.flatMap((s) => s.fields), [schema]);

  const update = (k: string, v: any) => setValues((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      if (disease === "breast-cancer") {
        // Map user-friendly inputs to clinical BreastCancerInput format
        const radiusMean = values.tumorSize / 3.14; // Tumor size in mm -> radius_mean
        const textureMean = values.textureIrregularity * 3; // Scale 1-10 -> texture_mean
        const smoothnessMean = (values.boundarySmoothness / 10) * 0.1; // Scale 1-10 -> smoothness_mean
        const concavityMean = values.cellUniformity / 10; // Scale 1-10 -> concavity_mean

        // Derive other fields using formulas
        const perimeterMean = radiusMean * 6.5;
        const areaMean = radiusMean * radiusMean * 3.14;
        const compactnessMean = concavityMean * 0.8;

        // All _se fields = corresponding _mean * 0.15
        const radiusSe = radiusMean * 0.15;
        const textureSe = textureMean * 0.15;
        const perimeterSe = perimeterMean * 0.15;
        const areaSe = areaMean * 0.15;
        const smoothnessSe = smoothnessMean * 0.15;
        const compactnessSe = compactnessMean * 0.15;
        const concavitySe = concavityMean * 0.15;
        const concavePointsSe = (concavityMean * 0.1) * 0.15;
        const symmetrySe = 0.1 * 0.15; // default
        const fractalDimensionSe = 0.005 * 0.15; // default

        // All _worst fields = corresponding _mean * 1.8
        const radiusWorst = radiusMean * 1.8;
        const textureWorst = textureMean * 1.8;
        const perimeterWorst = perimeterMean * 1.8;
        const areaWorst = areaMean * 1.8;
        const smoothnessWorst = smoothnessMean * 1.8;
        const compactnessWorst = compactnessMean * 1.8;
        const concavityWorst = concavityMean * 1.8;
        const concavePointsWorst = (concavityMean * 0.1) * 1.8;
        const symmetryWorst = 0.1 * 1.8;
        const fractalDimensionWorst = 0.005 * 1.8;

        const breastCancerData = {
          radius_mean: radiusMean,
          texture_mean: textureMean,
          perimeter_mean: perimeterMean,
          area_mean: areaMean,
          smoothness_mean: smoothnessMean,
          compactness_mean: compactnessMean,
          concavity_mean: concavityMean,
          concave_points_mean: concavityMean * 0.1,
          symmetry_mean: 0.1,
          fractal_dimension_mean: 0.005,
          radius_se: radiusSe,
          texture_se: textureSe,
          perimeter_se: perimeterSe,
          area_se: areaSe,
          smoothness_se: smoothnessSe,
          compactness_se: compactnessSe,
          concavity_se: concavitySe,
          concave_points_se: concavePointsSe,
          symmetry_se: symmetrySe,
          fractal_dimension_se: fractalDimensionSe,
          radius_worst: radiusWorst,
          texture_worst: textureWorst,
          perimeter_worst: perimeterWorst,
          area_worst: areaWorst,
          smoothness_worst: smoothnessWorst,
          compactness_worst: compactnessWorst,
          concavity_worst: concavityWorst,
          concave_points_worst: concavePointsWorst,
          symmetry_worst: symmetryWorst,
          fractal_dimension_worst: fractalDimensionWorst,
        };

        const result = await predictBreastCancer(breastCancerData);
        setResult(result);
        navigate({ to: "/results" });
      } else {
        // Fallback for other diseases
        navigate({ to: "/results", search: { disease } as any });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Analysis failed, please try again");
      console.error("Prediction error:", error);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingScreen />}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 flex items-baseline justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">{schema.name} Assessment</h1>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </span>
        </div>

        {/* progress */}
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
              <p className="text-sm text-muted-foreground">Provide the details below. Hover any field for normal-range guidance.</p>
              <div className="mt-7 space-y-7">
                {current.fields.map((f) => (
                  <FieldRenderer key={f.key} field={f} value={values[f.key]} onChange={(v) => update(f.key, v)} />
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--emerald)]" /> Review your data
              </h2>
              <p className="text-sm text-muted-foreground">Confirm the values below, then run the analysis.</p>
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
            <Button
              onClick={submit}
              className="bg-gradient-to-r from-[var(--electric)] to-[var(--emerald)] hover:opacity-95 text-white border-0 shadow-lg shadow-[var(--electric)]/30"
            >
              <Sparkles /> Analyze My Health
            </Button>
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

function FieldRenderer({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
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
        {field.type === "toggle" && (
          <div className="flex items-center gap-3">
            <Switch checked={!!value} onCheckedChange={onChange} />
            <span className="text-sm text-muted-foreground">{value ? "Yes" : "No"}</span>
          </div>
        )}
      </div>
      {field.helper && <p className="mt-2 text-xs text-muted-foreground">{field.helper}</p>}
    </div>
  );
}
