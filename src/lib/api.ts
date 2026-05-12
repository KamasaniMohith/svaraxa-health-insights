const API_BASE = "https://theomverse-svaraxa-api.hf.space";

// ---------- Types ----------
export interface PredictionResult {
  disease: string;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  health_age?: number;
  actual_age?: number;
  top_factors: {
    factor: string;
    impact: string;
    score: number;
  }[];
  recommendations: string[];
  disclaimer: string;
}

// ---------- Diabetes ----------
export interface DiabetesInput {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree: number;
  age: number;
}

// ---------- Heart ----------
export interface HeartInput {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

// ---------- Breast Cancer ----------
export interface BreastCancerInput {
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  symmetry_mean: number;
  fractal_dimension_mean: number;
  radius_se: number;
  texture_se: number;
  perimeter_se: number;
  area_se: number;
  smoothness_se: number;
  compactness_se: number;
  concavity_se: number;
  concave_points_se: number;
  symmetry_se: number;
  fractal_dimension_se: number;
  radius_worst: number;
  texture_worst: number;
  perimeter_worst: number;
  area_worst: number;
  smoothness_worst: number;
  compactness_worst: number;
  concavity_worst: number;
  concave_points_worst: number;
  symmetry_worst: number;
  fractal_dimension_worst: number;
}

// ---------- API Calls ----------
export async function predictDiabetes(
  data: DiabetesInput
): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict/diabetes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Diabetes prediction failed");
  return res.json();
}

export async function predictHeart(
  data: HeartInput
): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict/heart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Heart prediction failed");
  return res.json();
}

export async function predictBreastCancer(
  data: BreastCancerInput
): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict/breast-cancer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Breast cancer prediction failed");
  return res.json();
}