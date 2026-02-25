import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Loader2, Zap, LogIn } from 'lucide-react';
import { type Task, Category } from '@/backend';
import { useSubmitTaskCompletion } from '@/hooks/useQueries';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TaskDetailModalProps {
    task: Task | null;
    onClose: () => void;
}

const categoryLabels: Record<string, string> = {
    [Category.coffee]: 'Coffee',
    [Category.tea]: 'Tea',
    [Category.snacks]: 'Snacks',
    [Category.meals]: 'Meals',
};

export default function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
    const { isAuthenticated, login, isLoggingIn } = useAuth();
    const { mutate: submitCompletion, isPending } = useSubmitTaskCompletion();

    if (!task) return null;

    const categoryKey = Object.keys(task.category)[0] as string;
    const categoryLabel = categoryLabels[categoryKey] ?? categoryKey;

    const handleComplete = () => {
        submitCompletion(task.id, {
            onSuccess: () => {
                toast.success('Task submitted! Your completion is pending review.');
                onClose();
            },
            onError: (err: unknown) => {
                const error = err as Error;
                toast.error(error?.message || 'Failed to submit task. Please try again.');
            },
        });
    };

    return (
        <Dialog open={!!task} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-3 mb-1">
                        <Badge variant="secondary" className="text-xs font-medium">
                            {categoryLabel}
                        </Badge>
                        <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1 rounded-full shrink-0">
                            <Coins className="w-4 h-4 text-accent" />
                            <span className="text-sm font-semibold font-body text-accent">
                                {task.reward.toString()} tokens
                            </span>
                        </div>
                    </div>
                    <DialogTitle className="font-display text-xl text-foreground mt-2">
                        {task.title}
                    </DialogTitle>
                    <DialogDescription className="font-body text-sm text-muted-foreground leading-relaxed mt-2">
                        {task.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="my-2 p-4 bg-secondary/50 rounded-lg border border-border">
                    <p className="font-body text-xs text-muted-foreground mb-1">Reward for completion</p>
                    <div className="flex items-center gap-2">
                        <img
                            src="/assets/generated/task-reward-icon.dim_400x400.png"
                            alt="Reward"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-display text-2xl font-bold text-foreground">
                            {task.reward.toString()}
                        </span>
                        <span className="font-body text-sm text-muted-foreground">tokens</span>
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    {isAuthenticated ? (
                        <Button
                            onClick={handleComplete}
                            disabled={isPending}
                            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting…
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4" />
                                    Complete This Task
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="w-full flex flex-col gap-3">
                            <p className="font-body text-sm text-center text-muted-foreground">
                                Sign in to complete tasks and earn tokens.
                            </p>
                            <Button
                                onClick={login}
                                disabled={isLoggingIn}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold gap-2"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        Sign In to Complete
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
