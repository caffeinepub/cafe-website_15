import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Coins, Clock } from 'lucide-react';
import { type TaskCompletion } from '@/backend';

interface CompletedTasksListProps {
    completions: TaskCompletion[] | undefined;
    isLoading: boolean;
}

function formatDate(timestamp: bigint): string {
    // Motoko Time is in nanoseconds
    const ms = Number(timestamp / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function CompletedTasksList({ completions, isLoading }: CompletedTasksListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-border shadow-card">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-col gap-2 flex-1">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                                <Skeleton className="h-6 w-20 shrink-0" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!completions || completions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    No completed tasks yet
                </h3>
                <p className="font-body text-sm text-muted-foreground max-w-xs">
                    Head over to the Tasks page to find your first task and start earning tokens!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {completions.map((completion, idx) => (
                <Card key={idx} className="border border-border shadow-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                    completion.approved
                                        ? 'bg-accent/20 text-accent'
                                        : 'bg-secondary text-muted-foreground'
                                }`}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <p className="font-body text-sm font-medium text-foreground">
                                        Task #{completion.taskId.toString()}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground font-body">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(completion.completedAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full font-body ${
                                    completion.approved
                                        ? 'bg-accent/10 text-accent'
                                        : 'bg-secondary text-muted-foreground'
                                }`}>
                                    {completion.approved ? 'Approved' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
