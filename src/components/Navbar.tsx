import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useUser, useClerk, UserButton } from "@clerk/tanstack-start";

export function Navbar() {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <header className="navbar">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-3">
            <img 
              src="/svaraxa-logo.png" 
              alt="SVARAXA" 
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span style={{ 
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1a1a1a',
                letterSpacing: '-0.01em'
              }}>
                SVARAXA
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: '500',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#9a9a9a'
              }}>
                Health AI
              </span>
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="transition-colors" style={{ color: 'var(--text-secondary)' }} activeOptions={{ exact: true }} activeProps={{ className: "font-semibold", style: { color: 'var(--text-primary)' } }}>Home</Link>
          <a href="/#diseases" className="transition-colors hover:font-semibold" style={{ color: 'var(--text-secondary)' }}>Assessments</a>
          <a href="/#how" className="transition-colors hover:font-semibold" style={{ color: 'var(--text-secondary)' }}>How it works</a>
          <a href="/#soon" className="transition-colors hover:font-semibold" style={{ color: 'var(--text-secondary)' }}>Coming Soon</a>
          {user && (
            <Link to="/history" className="transition-colors" style={{ color: 'var(--text-secondary)' }} activeProps={{ className: "font-semibold", style: { color: 'var(--text-primary)' } }}>History</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:inline-flex h-10 px-4"
              style={{ color: 'var(--text-secondary)', borderColor: 'rgba(0,0,0,0.12)' }}
              onClick={() => openSignIn()}
            >
              Sign In
            </Button>
          ) : (
            <UserButton />
          )}
          <Button size="sm" className="h-10 px-6 text-white border-0 font-semibold" style={{ background: 'var(--primary)', borderRadius: '8px' }} asChild>
            <a href="/#diseases">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
