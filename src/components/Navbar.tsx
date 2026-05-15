import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useClerk, UserButton } from "@clerk/tanstack-start";

export function Navbar() {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b" style={{ background: 'rgba(10,10,15,0.8)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6af7] to-[#4f9cf9] shadow-lg shadow-[#7c6af7]/20 group-hover:shadow-[#7c6af7]/30 transition-shadow">
              <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="text-lg font-semibold tracking-tight">SVARAXA</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#94a3b8] font-500">Health AI</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-[#94a3b8]">
            <Link to="/" className="hover:text-[#f8f8ff] transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-[#f8f8ff]" }}>Home</Link>
            <a href="/#diseases" className="hover:text-[#f8f8ff] transition-colors">Assessments</a>
            <a href="/#how" className="hover:text-[#f8f8ff] transition-colors">How it works</a>
            <a href="/#soon" className="hover:text-[#f8f8ff] transition-colors">Coming Soon</a>
            {user && (
              <Link to="/history" className="hover:text-[#f8f8ff] transition-colors" activeProps={{ className: "text-[#f8f8ff]" }}>History</Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {!user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:inline-flex"
                onClick={() => openSignIn()}
              >
                Sign In
              </Button>
            ) : (
              <UserButton />
            )}
            <Button size="sm" className="bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white border-0 shadow-lg shadow-[#7c6af7]/30" asChild>
              <a href="/#diseases">Get Started</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
