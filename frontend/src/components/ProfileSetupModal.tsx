import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap } from 'lucide-react';
import { useRegisterUser } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
    const [username, setUsername] = useState('');
    const { mutate: registerUser, isPending } = useRegisterUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (!trimmed) return;

        registerUser(trimmed, {
            onSuccess: () => {
                toast.success('Welcome to TaskEarn! Your profile has been created.');
            },
            onError: (err: unknown) => {
                const error = err as Error;
                toast.error(error?.message || 'Failed to create profile. Please try again.');
            },
        });
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <DialogTitle className="font-display text-xl">Welcome to TaskEarn!</DialogTitle>
                    </div>
                    <DialogDescription className="font-body text-sm text-muted-foreground">
                        Choose a username to get started. You'll use this to identify yourself on the platform.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="username" className="font-body text-sm font-medium">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="e.g. taskmaster42"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isPending}
                            maxLength={32}
                            autoFocus
                            className="font-body"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || !username.trim()}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating profile…
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                Get Started
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
