import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-hero">
      <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>About SVARAXA</h1>
            <p className="mt-4 text-lg text-[#94a3b8]">Understanding health risks with explainable AI</p>
          </div>

          {/* Our Mission Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Our Mission</h2>
            <div className="glass rounded-2xl p-8">
              <p className="text-[#94a3b8] leading-relaxed text-lg">
                SVARAXA was built with a simple belief: everyone deserves to understand their health risks before they become serious. Using state-of-the-art machine learning models trained on clinical datasets, SVARAXA provides explainable, actionable risk assessments for Heart Disease, Diabetes, and Breast Cancer.
              </p>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>How It Works</h2>
            <div className="glass rounded-2xl p-8">
              <p className="text-[#94a3b8] leading-relaxed text-lg">
                Our models are trained on validated medical datasets (UCI Cleveland Heart Disease, Pima Indians Diabetes, Wisconsin Breast Cancer Diagnostic). We use XGBoost classifiers with SHAP explainability to surface the factors driving each prediction.
              </p>
            </div>
          </section>

          {/* Model Performance Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Model Performance</h2>
            <div className="glass rounded-2xl p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.1)]">
                    <th className="text-left py-3 px-4 font-semibold text-[#f8f8ff]">Disease</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#f8f8ff]">Accuracy</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#f8f8ff]">AUC-ROC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[rgba(255,255,255,0.05)]">
                    <td className="py-3 px-4 text-[#94a3b8]">Heart Disease</td>
                    <td className="py-3 px-4 text-[#22c55e] font-semibold">86.7%</td>
                    <td className="py-3 px-4 text-[#22c55e] font-semibold">0.926</td>
                  </tr>
                  <tr className="border-b border-[rgba(255,255,255,0.05)]">
                    <td className="py-3 px-4 text-[#94a3b8]">Diabetes</td>
                    <td className="py-3 px-4 text-[#f59e0b] font-semibold">75.3%</td>
                    <td className="py-3 px-4 text-[#f59e0b] font-semibold">0.821</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-[#94a3b8]">Breast Cancer</td>
                    <td className="py-3 px-4 text-[#22c55e] font-semibold">96.5%</td>
                    <td className="py-3 px-4 text-[#22c55e] font-semibold">0.994</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Important Disclaimer</h2>
            <div className="flex items-start gap-4 rounded-2xl border border-[#ef4444]/40 bg-[#ef4444]/10 p-6">
              <AlertTriangle className="h-6 w-6 text-[#ef4444] mt-1 shrink-0" />
              <p className="text-[#94a3b8] leading-relaxed text-lg">
                <strong className="text-[#f8f8ff]">SVARAXA is an educational awareness tool.</strong> It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider regarding any medical conditions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
