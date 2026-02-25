import { Zap, Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
    const year = new Date().getFullYear();
    const appId = encodeURIComponent(
        typeof window !== 'undefined' ? window.location.hostname : 'taskearn-app'
    );

    return (
        <footer className="bg-foreground text-background/90">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="font-display text-xl font-bold text-background">
                                Task<span className="text-accent">Earn</span>
                            </span>
                        </div>
                        <p className="font-body text-sm text-background/70 leading-relaxed max-w-xs">
                            Complete small tasks and earn real token rewards. Start earning today with TaskEarn.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display text-base font-semibold text-background mb-4">Quick Links</h3>
                        <nav className="flex flex-col gap-2">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Browse Tasks', path: '/tasks' },
                                { label: 'Dashboard', path: '/dashboard' },
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="font-body text-sm text-background/70 hover:text-background transition-colors duration-200 w-fit"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Platform Info */}
                    <div>
                        <h3 className="font-display text-base font-semibold text-background mb-4">Platform</h3>
                        <div className="flex flex-col gap-2">
                            <p className="font-body text-sm text-background/70">
                                Earn tokens by completing simple tasks.
                            </p>
                            <p className="font-body text-sm text-background/70">
                                Withdraw your earnings anytime.
                            </p>
                            <p className="font-body text-sm text-background/70">
                                Secured by Internet Identity.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-background/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="font-body text-xs text-background/50">
                        © {year} TaskEarn. All rights reserved.
                    </p>
                    <p className="font-body text-xs text-background/50 flex items-center gap-1">
                        Built with{' '}
                        <Heart className="w-3 h-3 text-accent fill-accent" aria-label="love" />{' '}
                        using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-background/70 hover:text-background underline underline-offset-2 transition-colors"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
