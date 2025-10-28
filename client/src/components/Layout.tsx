import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { Home, Users, Shield, Trophy, TrendingUp } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home, testId: "link-dashboard" },
    { path: "/players", label: "Players", icon: Users, testId: "link-players" },
    { path: "/teams", label: "Teams", icon: Shield, testId: "link-teams" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 hover-elevate px-3 py-2 rounded-xl transition-all">
                <div className="relative">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 blur-lg" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" data-testid="text-logo">
                    NBA Stats
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Live Tracker</span>
                </div>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        className={`
                          relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25' 
                            : 'hover-elevate text-foreground/70 hover:text-foreground'
                          }
                        `}
                        data-testid={item.testId}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-success-green" />
                <span className="text-sm font-mono font-semibold text-foreground">2024-25 Season</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <nav className="lg:hidden flex gap-2 pb-4 overflow-x-auto snap-x snap-mandatory">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`
                      snap-start px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                        : 'hover-elevate bg-muted/30 text-foreground/70'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-border/50 mt-16 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">NBA Stats Tracker</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Real-time basketball statistics, player performance analytics, and comprehensive team data for the 2024-25 NBA season.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground/80">Quick Links</h3>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground/80">Data Source</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Stats.NBA.com API with graceful fallback data when unavailable.
              </p>
              <div className="flex gap-2 mt-2">
                <div className="px-3 py-1 rounded-lg bg-success-green/10 text-success-green text-xs font-semibold">
                  Live Updates
                </div>
                <div className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
                  Real-time
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024-25 NBA Stats Tracker. All statistics provided for informational purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
