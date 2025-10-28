import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { Home, Users, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home, testId: "link-dashboard" },
    { path: "/players", label: "Players", icon: Users, testId: "link-players" },
    { path: "/teams", label: "Teams", icon: Shield, testId: "link-teams" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 hover-elevate px-2 py-1 rounded-lg">
                <Activity className="w-6 h-6 text-nba-orange" />
                <span className="text-xl font-bold" data-testid="text-logo">NBA Stats Tracker</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="gap-2"
                        data-testid={item.testId}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>

          <nav className="md:hidden flex gap-2 pb-3 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>NBA Stats Tracker - Real-time basketball statistics and analytics</p>
            <p className="mt-1">Data provided by BallDontLie API</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
