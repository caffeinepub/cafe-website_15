import { Link } from '@tanstack/react-router';
import { ArrowRight, CheckCircle2, Coins, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const steps = [
    {
        icon: UserPlus,
        step: '01',
        title: 'Sign Up',
        description: 'Create your account using Internet Identity — no passwords needed. Secure and instant.',
    },
    {
        icon: CheckCircle2,
        step: '02',
        title: 'Pick a Task',
        description: 'Browse available tasks across different categories. Choose what interests you most.',
    },
    {
        icon: Coins,
        step: '03',
        title: 'Get Paid',
        description: 'Complete tasks and earn token rewards. Request withdrawals anytime from your dashboard.',
    },
];

export default function HomePage() {
    const { isAuthenticated, login, isLoggingIn } = useAuth();

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1200x500.png')" }}
                />
                <div className="absolute inset-0 bg-foreground/65" />
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-2xl animate-fade-in">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold font-body tracking-wide uppercase mb-6 border border-accent/30">
                            <Coins className="w-3.5 h-3.5" />
                            Earn Real Rewards
                        </span>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-background leading-tight mb-6">
                            Task<span className="text-accent">Earn</span>
                        </h1>
                        <p className="font-body text-xl text-background/85 leading-relaxed mb-4 max-w-lg font-medium">
                            Complete small tasks. Earn real rewards.
                        </p>
                        <p className="font-body text-base text-background/70 leading-relaxed mb-10 max-w-lg">
                            Join thousands of earners completing simple tasks and getting paid in tokens. Start earning today — no experience required.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="font-body font-semibold bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 rounded-full shadow-glow-green transition-all duration-200 hover:scale-105"
                            >
                                <Link to="/tasks">
                                    Browse Tasks
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                            {!isAuthenticated && (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={login}
                                    disabled={isLoggingIn}
                                    className="font-body font-semibold border-background/50 text-background bg-transparent hover:bg-background/10 px-8 py-3 rounded-full transition-all duration-200"
                                >
                                    {isLoggingIn ? 'Signing in…' : 'Sign In to Earn'}
                                </Button>
                            )}
                            {isAuthenticated && (
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="font-body font-semibold border-background/50 text-background bg-transparent hover:bg-background/10 px-8 py-3 rounded-full transition-all duration-200"
                                >
                                    <Link to="/dashboard">My Dashboard</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="bg-primary text-primary-foreground py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        {[
                            { value: '100+', label: 'Tasks Available', desc: 'New tasks added regularly' },
                            { value: '500+', label: 'Active Earners', desc: 'Growing community' },
                            { value: '10K+', label: 'Tokens Paid Out', desc: 'Real rewards distributed' },
                        ].map(({ value, label, desc }) => (
                            <div key={label} className="flex flex-col items-center gap-1 py-2">
                                <span className="font-display text-3xl font-bold">{value}</span>
                                <span className="font-display text-sm font-semibold opacity-90">{label}</span>
                                <span className="font-body text-xs opacity-65">{desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-3 block">
                            Simple Process
                        </span>
                        <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="font-body text-base text-muted-foreground max-w-md mx-auto">
                            Three simple steps to start earning tokens from the comfort of your home.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map(({ icon: Icon, step, title, description }) => (
                            <div
                                key={step}
                                className="relative flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-shadow duration-200"
                            >
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-display shadow-glow">
                                    {step}
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mt-2">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-display text-xl font-bold text-foreground mb-3">{title}</h3>
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-14">
                        <Button
                            asChild
                            size="lg"
                            className="font-body font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 shadow-glow transition-all duration-200 hover:scale-105"
                        >
                            <Link to="/tasks">
                                Start Earning Now
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 bg-primary/5 border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Ready to Start Earning?
                    </h2>
                    <p className="font-body text-base text-muted-foreground mb-8 max-w-md mx-auto">
                        Join TaskEarn today and turn your spare time into real token rewards.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="font-body font-semibold bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 shadow-glow-green transition-all duration-200 hover:scale-105"
                        >
                            <Link to="/tasks">
                                Browse Tasks
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
