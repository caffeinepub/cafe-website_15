import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins, TrendingUp } from 'lucide-react';

interface BalanceCardProps {
    balance: bigint | undefined;
    isLoading: boolean;
}

export default function BalanceCard({ balance, isLoading }: BalanceCardProps) {
    return (
        <Card className="border border-border shadow-card bg-gradient-to-br from-primary/10 to-accent/5">
            <CardHeader className="pb-2">
                <CardTitle className="font-display text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Coins className="w-4 h-4 text-accent" />
                    Current Balance
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ) : (
                    <div className="flex items-end gap-2">
                        <span className="font-display text-4xl font-bold text-foreground">
                            {balance?.toString() ?? '0'}
                        </span>
                        <span className="font-body text-base text-muted-foreground mb-1">tokens</span>
                    </div>
                )}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-body">
                    <TrendingUp className="w-3.5 h-3.5 text-accent" />
                    Earned from completed tasks
                </div>
            </CardContent>
        </Card>
    );
}
