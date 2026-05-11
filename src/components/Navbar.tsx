import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--electric)] to-[var(--emerald)] shadow-lg shadow-[var(--electric)]/30 group-hover:shadow-[var(--electric)]/50 transition-shadow">
              <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="text-lg font-bold tracking-tight">SVARAXA</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Health AI</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Home</Link>
            <a href="/#diseases" className="hover:text-foreground transition-colors">Assessments</a>
            <a href="/#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="/#soon" className="hover:text-foreground transition-colors">Coming Soon</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            <Button size="sm" className="bg-gradient-to-r from-[var(--electric)] to-[var(--emerald)] hover:opacity-90 text-white border-0" asChild>
              <a href="/#diseases">Get Started</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
