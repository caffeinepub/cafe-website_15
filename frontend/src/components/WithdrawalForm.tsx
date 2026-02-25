import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowDownToLine } from 'lucide-react';
import { useRequestWithdrawal } from '@/hooks/useQueries';
import { toast } from 'sonner';

interface WithdrawalFormProps {
    balance: bigint | undefined;
}

export default function WithdrawalForm({ balance }: WithdrawalFormProps) {
    const [amount, setAmount] = useState('');
    const { mutate: requestWithdrawal, isPending } = useRequestWithdrawal();

    const currentBalance = balance ?? BigInt(0);
    const parsedAmount = parseInt(amount, 10);
    const isValid =
        amount.trim() !== '' &&
        !isNaN(parsedAmount) &&
        parsedAmount > 0 &&
        BigInt(parsedAmount) <= currentBalance;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        requestWithdrawal(BigInt(parsedAmount), {
            onSuccess: () => {
                toast.success(`Withdrawal request for ${parsedAmount} tokens submitted!`);
                setAmount('');
            },
            onError: (err: unknown) => {
                const error = err as Error;
                toast.error(error?.message || 'Failed to submit withdrawal request.');
            },
        });
    };

    return (
        <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
                <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                    <ArrowDownToLine className="w-4 h-4 text-primary" />
                    Request Withdrawal
                </CardTitle>
                <CardDescription className="font-body text-sm text-muted-foreground">
                    Available balance: <span className="font-semibold text-foreground">{currentBalance.toString()} tokens</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="withdrawal-amount" className="font-body text-sm font-medium">
                            Amount (tokens)
                        </Label>
                        <Input
                            id="withdrawal-amount"
                            type="number"
                            min="1"
                            max={currentBalance.toString()}
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isPending}
                            className="font-body"
                        />
                        {amount && !isValid && (
                            <p className="text-xs text-destructive font-body">
                                {parsedAmount <= 0
                                    ? 'Amount must be greater than 0.'
                                    : `Amount cannot exceed your balance of ${currentBalance.toString()} tokens.`}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || !isValid}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting…
                            </>
                        ) : (
                            <>
                                <ArrowDownToLine className="w-4 h-4" />
                                Request Withdrawal
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
