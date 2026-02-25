import { Badge } from '@/components/ui/badge';
import { Coins, ChevronRight } from 'lucide-react';
import { type Task, Category } from '@/backend';

interface TaskCardProps {
    task: Task;
    onClick: () => void;
}

const categoryColors: Record<string, string> = {
    [Category.coffee]: 'bg-amber-100 text-amber-800 border-amber-200',
    [Category.tea]: 'bg-green-100 text-green-800 border-green-200',
    [Category.snacks]: 'bg-orange-100 text-orange-800 border-orange-200',
    [Category.meals]: 'bg-blue-100 text-blue-800 border-blue-200',
};

const categoryLabels: Record<string, string> = {
    [Category.coffee]: 'Coffee',
    [Category.tea]: 'Tea',
    [Category.snacks]: 'Snacks',
    [Category.meals]: 'Meals',
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const categoryKey = Object.keys(task.category)[0] as string;
    const colorClass = categoryColors[categoryKey] ?? 'bg-secondary text-secondary-foreground border-border';
    const categoryLabel = categoryLabels[categoryKey] ?? categoryKey;

    const descriptionSnippet =
        task.description.length > 100
            ? task.description.slice(0, 100) + '…'
            : task.description;

    return (
        <button
            onClick={onClick}
            className="group w-full text-left bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
                >
                    {categoryLabel}
                </span>
                <div className="flex items-center gap-1 shrink-0 bg-accent/10 text-accent-foreground px-2.5 py-1 rounded-full">
                    <Coins className="w-3.5 h-3.5 text-accent" />
                    <span className="text-sm font-semibold font-body text-accent">
                        {task.reward.toString()} tokens
                    </span>
                </div>
            </div>

            <h3 className="font-display text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                {task.title}
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                {descriptionSnippet}
            </p>

            <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View details
                <ChevronRight className="w-3.5 h-3.5" />
            </div>
        </button>
    );
}
