import { useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { useGetMyBalance, useGetMyCompletions } from '@/hooks/useQueries';
import BalanceCard from '@/components/BalanceCard';
import CompletedTasksList from '@/components/CompletedTasksList';
import WithdrawalForm from '@/components/WithdrawalForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ListChecks, ArrowRight, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { isAuthenticated, isInitializing, userProfile, profileLoading } = useAuth();

    const { data: balance, isLoading: balanceLoading } = useGetMyBalance();
    const { data: completions, isLoading: completionsLoading } = useGetMyCompletions();

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            navigate({ to: '/' });
        }
    }, [isAuthenticated, isInitializing, navigate]);

    if (isInitializing || (!isAuthenticated && !isInitializing)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const totalEarned = completions
        ? completions.filter((c) => c.approved).length
        : 0;
    const totalCompleted = completions?.length ?? 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="bg-card border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                                Dashboard
                            </h1>
                            {profileLoading ? (
                                <Skeleton className="h-4 w-32 mt-1" />
                            ) : userProfile ? (
                                <p className="font-body text-sm text-muted-foreground mt-0.5">
                                    Welcome back, <span className="font-semibold text-foreground">{userProfile.username}</span>!
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Balance + Summary Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <BalanceCard balance={balance} isLoading={balanceLoading} />

                            {/* Summary Card */}
                            <Card className="border border-border shadow-card">
                                <CardHeader className="pb-2">
                                    <CardTitle className="font-display text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <ListChecks className="w-4 h-4 text-primary" />
                                        Task Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {completionsLoading ? (
                                        <div className="flex flex-col gap-3">
                                            <Skeleton className="h-8 w-16" />
                                            <Skeleton className="h-4 w-28" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <div>
                                                <span className="font-display text-4xl font-bold text-foreground">
                                                    {totalCompleted}
                                                </span>
                                                <p className="font-body text-xs text-muted-foreground mt-0.5">
                                                    Tasks submitted
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                                                <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                                                {totalEarned} approved
                                                <span className="w-2 h-2 rounded-full bg-secondary inline-block ml-1" />
                                                {totalCompleted - totalEarned} pending
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Completed Tasks */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-lg font-semibold text-foreground">
                                    Completed Tasks
                                </h2>
                                <Button asChild variant="ghost" size="sm" className="font-body text-sm text-primary gap-1">
                                    <Link to="/tasks">
                                        Find more tasks
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </Button>
                            </div>
                            <CompletedTasksList
                                completions={completions}
                                isLoading={completionsLoading}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-5">
                        <WithdrawalForm balance={balance} />

                        <Card className="border border-border shadow-card bg-primary/5">
                            <CardContent className="p-5">
                                <h3 className="font-display text-sm font-semibold text-foreground mb-2">
                                    Earn More Tokens
                                </h3>
                                <p className="font-body text-xs text-muted-foreground mb-4 leading-relaxed">
                                    Browse available tasks and complete them to increase your balance.
                                </p>
                                <Button
                                    asChild
                                    size="sm"
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-medium gap-1.5 rounded-full"
                                >
                                    <Link to="/tasks">
                                        Browse Tasks
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
