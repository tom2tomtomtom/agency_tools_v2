'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { teams } from '@/lib/prompts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Star,
  Puzzle,
  Menu,
  X
} from 'lucide-react';

const teamIcons: Record<string, string> = {
  'behavioural-science-team': '🧠',
  'brand-strategy-team': '🎯',
  'campaign-management-team': '📊',
  'client-experience-team': '👥',
  'creative-integrated-team': '🎨',
  'crisis-communications-team': '🛡️',
  'events-experiential-team': '🎪',
  'government-relations-team': '🏛️',
  'influencer-partnership-team': '🤝',
  'insights-measurement-team': '📈',
  'leadership-team': '👔',
  'new-business-team': '💼',
  'operations-culture-team': '⚙️',
  'pr-media-relations-team': '📣',
  'social-content-team': '📱',
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/" className="font-bold text-lg truncate">
            AI Tools
          </Link>
        )}
        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 hidden md:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="h-8 w-8 md:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          {/* Main Links */}
          <NavLink href="/" icon={<Home className="h-4 w-4" />} collapsed={collapsed} active={pathname === '/'}>
            Home
          </NavLink>
          <NavLink href="/search" icon={<Search className="h-4 w-4" />} collapsed={collapsed} active={pathname === '/search'}>
            Search
          </NavLink>
          <NavLink href="/favorites" icon={<Star className="h-4 w-4" />} collapsed={collapsed} active={pathname === '/favorites'}>
            Favorites
          </NavLink>
          <NavLink href="/plugins" icon={<Puzzle className="h-4 w-4" />} collapsed={collapsed} active={pathname === '/plugins'}>
            Cowork Plugins
          </NavLink>

          {/* Separator */}
          <div className="my-4 h-px bg-border" />

          {/* Teams */}
          {!collapsed && (
            <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Teams
            </div>
          )}
          {teams.map(team => (
            <NavLink
              key={team.slug}
              href={`/team/${team.slug}`}
              icon={<span className="text-base" role="img" aria-label={team.name}>{teamIcons[team.slug] || '📁'}</span>}
              collapsed={collapsed}
              active={pathname === `/team/${team.slug}`}
            >
              {team.name.replace(' Team', '')}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            {teams.reduce((acc, t) => acc + t.solutionCount, 0)} prompts across {teams.length} teams
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button - fixed in header area */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 h-10 w-10 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar (drawer) */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 bg-background border-r transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300 hidden md:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed: boolean;
  active: boolean;
}

function NavLink({ href, icon, children, collapsed, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      {icon}
      {!collapsed && <span className="truncate">{children}</span>}
    </Link>
  );
}
