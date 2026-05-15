import { Activity } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--electric)] to-[var(--emerald)]">
                <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold">SVARAXA</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              AI-powered early health risk detection. SVARAXA helps you understand
              your risk profile with explainable AI — backed by clinical research.
            </p>
            <p className="mt-4 max-w-md text-xs text-muted-foreground/80 leading-relaxed">
              <strong className="text-foreground/80">Medical disclaimer:</strong> SVARAXA does not provide
              medical diagnosis. Results are informational only. Always consult a licensed healthcare professional.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#diseases" className="hover:text-foreground">Assessments</a></li>
              <li><a href="/#how" className="hover:text-foreground">How it works</a></li>
              <li><a href="/#soon" className="hover:text-foreground">Coming soon</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SVARAXA. All rights reserved.</p>
          <p>Built with explainable AI · HIPAA-minded design</p>
        </div>
      </div>
    </footer>
  );
}
