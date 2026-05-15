import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="bg-hero">
      <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6af7]/20 to-[#4f9cf9]/20 border border-[rgba(255,255,255,0.1)] text-[#7c6af7] mx-auto mb-6">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Terms of Use</h1>
            <p className="mt-4 text-sm text-[#94a3b8]">Please read carefully before using SVARAXA</p>
          </div>

          {/* Content */}
          <div className="glass rounded-2xl p-8 md:p-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#f8f8ff] mb-6" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Terms & Conditions</h2>
                <p className="text-[#94a3b8] leading-relaxed text-lg mb-6">
                  By using SVARAXA, you agree to the following terms:
                </p>
              </div>

              {/* Terms List */}
              <div className="space-y-6">
                <div className="border-l-4 border-[#7c6af7] pl-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7c6af7]/20 text-[#7c6af7] font-semibold text-sm mt-1 shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#f8f8ff] mb-2">Educational Purpose Only</h3>
                      <p className="text-[#94a3b8] leading-relaxed">
                        SVARAXA provides AI-generated risk estimates for educational purposes only. The tool is designed to increase health awareness, not replace medical expertise.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-[#4f9cf9] pl-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4f9cf9]/20 text-[#4f9cf9] font-semibold text-sm mt-1 shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#f8f8ff] mb-2">NOT Medical Diagnosis</h3>
                      <p className="text-[#94a3b8] leading-relaxed">
                        Results are NOT medical diagnoses. SVARAXA cannot diagnose disease. Any assessment result should not be considered medical advice.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-[#22c55e] pl-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e]/20 text-[#22c55e] font-semibold text-sm mt-1 shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#f8f8ff] mb-2">Professional Consultation Required</h3>
                      <p className="text-[#94a3b8] leading-relaxed">
                        You will consult a licensed healthcare professional before making any health decisions based on SVARAXA results.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-[#f59e0b] pl-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f59e0b]/20 text-[#f59e0b] font-semibold text-sm mt-1 shrink-0">4</div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#f8f8ff] mb-2">Liability Disclaimer</h3>
                      <p className="text-[#94a3b8] leading-relaxed">
                        SVARAXA is not liable for any decisions made based on predictions or any consequences arising from use of the tool.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-[#ef4444] pl-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4444]/20 text-[#ef4444] font-semibold text-sm mt-1 shrink-0">5</div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#f8f8ff] mb-2">Age Requirement</h3>
                      <p className="text-[#94a3b8] leading-relaxed">
                        You are 18 years or older, or using this service with parental/guardian guidance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                <p className="text-sm text-[#94a3b8]">
                  By continuing to use SVARAXA, you acknowledge that you have read and agree to these terms. If you disagree with any part of these terms, please discontinue use immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
