import { createFileRoute } from "@tanstack/react-router";
import { AssessmentForm, type AssessmentConfig } from "@/components/AssessmentForm";

export const Route = createFileRoute("/assess/diabetes")({
  component: DiabetesAssessment,
});

const config: AssessmentConfig = {
  name: "Diabetes",
  slug: "diabetes",
  steps: [
    {
      title: "Basic Information",
      fields: [
        { key: "age", label: "Age", type: "slider", min: 1, max: 90, step: 1, defaultValue: 35, unit: "yrs" },
        {
          key: "gender", label: "Gender", type: "buttons", defaultValue: "f",
          options: [{ value: "m", label: "Male" }, { value: "f", label: "Female" }],
        },
        {
          key: "pregnancies", label: "Pregnancies", type: "slider",
          min: 0, max: 20, step: 1, defaultValue: 0,
          showIf: (v) => v.gender === "f",
          helper: "Number of pregnancies",
        },
      ],
    },
    {
      title: "Blood Metrics",
      fields: [
        { key: "glucose", label: "Glucose", type: "slider", min: 50, max: 250, step: 1, defaultValue: 110, unit: "mg/dL", helper: "Normal fasting: 70–100 mg/dL" },
        { key: "bp", label: "Blood Pressure", type: "slider", min: 40, max: 130, step: 1, defaultValue: 72, unit: "mmHg" },
        { key: "bmi", label: "BMI", type: "slider", min: 10, max: 60, step: 0.1, defaultValue: 25, unit: "kg/m²", helper: "Normal: 18.5–24.9" },
      ],
    },
    {
      title: "Additional Indicators",
      fields: [
        { key: "insulin", label: "Insulin", type: "number", min: 0, max: 900, step: 1, defaultValue: 80, helper: "2-hr serum insulin (µU/mL)" },
        { key: "dpf", label: "Diabetes Pedigree Function", type: "number", min: 0, max: 2.5, step: 0.01, defaultValue: 0.4, helper: "Family history score" },
      ],
    },
  ],
};

function DiabetesAssessment() {
  return <AssessmentForm config={config} />;
}
