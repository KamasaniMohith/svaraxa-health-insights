import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="bg-hero">
      <div className="bg-[radial-gradient(ellipse_at_top,transparent,var(--background)_70%)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6af7]/20 to-[#4f9cf9]/20 border border-[rgba(255,255,255,0.1)] text-[#7c6af7] mx-auto mb-6">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Privacy Policy</h1>
            <p className="mt-4 text-sm text-[#94a3b8]">Last updated: May 2026</p>
          </div>

          {/* Content */}
          <div className="glass rounded-2xl p-8 md:p-12">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#f8f8ff] mb-4" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Data Protection & Privacy</h2>
                  <p className="text-[#94a3b8] leading-relaxed text-lg">
                    <strong className="text-[#f8f8ff]">SVARAXA does not store any health data on external servers.</strong> All assessment inputs are sent directly to our prediction API and are not logged or retained after the response is returned.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#f8f8ff] mb-3" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Local Storage</h3>
                  <p className="text-[#94a3b8] leading-relaxed text-lg">
                    Saved reports are stored locally in your browser only. No data is transmitted to our servers for historical records. Your assessment history remains entirely under your control on your device.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#f8f8ff] mb-3" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Authentication</h3>
                  <p className="text-[#94a3b8] leading-relaxed text-lg">
                    We use <strong className="text-[#f8f8ff]">Clerk for authentication</strong> — please refer to Clerk's privacy policy for details on how account data is handled. Clerk is a trusted authentication provider used by thousands of applications.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#f8f8ff] mb-3" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Data Monetization</h3>
                  <p className="text-[#94a3b8] leading-relaxed text-lg">
                    <strong className="text-[#f8f8ff]">We do not sell, share, or monetize any user data.</strong> Your health information is yours alone. We are committed to your privacy and confidentiality.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                  <p className="text-sm text-[#94a3b8]">
                    If you have any privacy concerns or questions about how we handle data, please contact us. Your privacy is our top priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
