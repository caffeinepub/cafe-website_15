import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, Zap, LogOut, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tasks', path: '/tasks' },
    { label: 'Dashboard', path: '/dashboard' },
];

export default function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;
    const { isAuthenticated, isLoggingIn, identity, login, logout } = useAuth();

    const principalShort = identity
        ? identity.getPrincipal().toString().slice(0, 8) + '…'
        : '';

    return (
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-glow">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-display text-xl font-bold text-foreground tracking-tight">
                            Task<span className="text-accent">Earn</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = currentPath === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-md text-sm font-body font-medium transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth Controls */}
                    <div className="hidden md:flex items-center gap-2">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-body">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="font-mono text-xs">{principalShort}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className="text-muted-foreground hover:text-foreground gap-1.5"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                onClick={login}
                                disabled={isLoggingIn}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                            >
                                {isLoggingIn ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4" />
                                )}
                                {isLoggingIn ? 'Signing in…' : 'Sign In'}
                            </Button>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-card px-4 pb-4 pt-2 animate-fade-in">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => {
                            const isActive = currentPath === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-3 rounded-md text-sm font-body font-medium transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-3 pt-3 border-t border-border">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-body">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="font-mono text-xs">{principalShort}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { logout(); setMobileOpen(false); }}
                                    className="justify-start text-muted-foreground hover:text-foreground gap-1.5"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() => { login(); setMobileOpen(false); }}
                                disabled={isLoggingIn}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                            >
                                {isLoggingIn ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4" />
                                )}
                                {isLoggingIn ? 'Signing in…' : 'Sign In'}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
