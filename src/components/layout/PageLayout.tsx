import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ToyBrick, Calendar, Users, MailCheck, Menu, Image, Settings, Blocks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useFamilyStore } from '@/hooks/use-family-store';
const navLinks = [
  { href: '/sessions', label: 'Find Sessions', icon: Calendar },
  { href: '/idea-buffet', label: 'Idea Buffet', icon: Blocks },
  { href: '/legacy-wall', label: 'Legacy Wall', icon: Image },
  { href: '/family', label: 'My Family', icon: Users },
  { href: '/approvals', label: 'Approvals', icon: MailCheck },
  { href: '/admin', label: 'Admin', icon: Settings },
];
export function PageLayout({ children }: { children: React.ReactNode }) {
  const family = useFamilyStore(s => s.family);
  const loadDemoFamily = useFamilyStore(s => s.loadDemoFamily);
  React.useEffect(() => {
    if (!family) {
      loadDemoFamily();
    }
  }, [family, loadDemoFamily]);
  const NavContent = () => (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`
          }
        >
          <Icon className="w-4 h-4" />
          {label}
        </NavLink>
      ))}
    </>
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ToyBrick className="w-8 h-8 text-[#E53935]" />
              <span className="font-bold font-display text-xl tracking-tight">
                Community Brickyard
              </span>
            </Link>
            <nav className="hidden lg:flex items-center space-x-1">
              <NavContent />
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle className="relative top-0 right-0" />
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <nav className="flex flex-col space-y-4 mt-8">
                      <NavContent />
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="bg-muted">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>Built with ❤️ at Cloudflare</p>
        </div>
      </footer>
    </div>
  );
}