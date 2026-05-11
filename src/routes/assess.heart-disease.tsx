import { createFileRoute } from "@tanstack/react-router";
import { AssessmentForm, type AssessmentConfig } from "@/components/AssessmentForm";

export const Route = createFileRoute("/assess/heart-disease")({
  component: HeartDiseaseAssessment,
});

const config: AssessmentConfig = {
  name: "Heart Disease",
  slug: "heart",
  steps: [
    {
      title: "Basic Information",
      fields: [
        { key: "age", label: "Age", type: "slider", min: 20, max: 90, step: 1, defaultValue: 45, unit: "yrs" },
        {
          key: "gender", label: "Gender", type: "buttons", defaultValue: "m",
          options: [{ value: "m", label: "Male" }, { value: "f", label: "Female" }],
        },
        {
          key: "cp", label: "Do you have chest pain?", type: "select", defaultValue: "none",
          options: [
            { value: "none", label: "No pain" },
            { value: "ta", label: "Typical angina" },
            { value: "aa", label: "Atypical angina" },
            { value: "nap", label: "Non-anginal pain" },
          ],
        },
      ],
    },
    {
      title: "Cardiovascular Metrics",
      fields: [
        { key: "bp", label: "Resting Blood Pressure", type: "slider", min: 80, max: 200, step: 1, defaultValue: 120, unit: "mmHg", helper: "Normal: 80–120" },
        { key: "chol", label: "Cholesterol", type: "slider", min: 100, max: 600, step: 1, defaultValue: 200, unit: "mg/dL", helper: "Normal: below 200" },
        { key: "fbs", label: "Fasting Blood Sugar above 120 mg/dL?", type: "toggle", defaultValue: false },
      ],
    },
    {
      title: "Activity & ECG",
      fields: [
        { key: "thalach", label: "Max Heart Rate", type: "slider", min: 60, max: 220, step: 1, defaultValue: 150, unit: "bpm", helper: "Normal: 60–100 at rest" },
        { key: "exang", label: "Exercise-induced angina", type: "toggle", defaultValue: false },
        { key: "oldpeak", label: "ST Depression", type: "number", min: 0, max: 6, step: 0.1, defaultValue: 0, helper: "Enter 0 if unsure" },
      ],
    },
  ],
};

function HeartDiseaseAssessment() {
  return <AssessmentForm config={config} />;
}
