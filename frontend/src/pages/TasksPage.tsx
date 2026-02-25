import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useListAvailableTasks } from '@/hooks/useQueries';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import { type Task, Category } from '@/backend';

const CATEGORY_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Coffee', value: Category.coffee },
    { label: 'Tea', value: Category.tea },
    { label: 'Snacks', value: Category.snacks },
    { label: 'Meals', value: Category.meals },
];

export default function TasksPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const { data: tasks, isLoading } = useListAvailableTasks();

    const filteredTasks =
        selectedCategory === 'all'
            ? (tasks ?? [])
            : (tasks ?? []).filter((task) => {
                  const categoryKey = Object.keys(task.category)[0];
                  return categoryKey === selectedCategory;
              });

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="bg-card border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <span className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2 block">
                                Available Tasks
                            </span>
                            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                                Browse & Earn
                            </h1>
                            <p className="font-body text-sm text-muted-foreground mt-2">
                                {isLoading
                                    ? 'Loading tasks…'
                                    : `${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''} available`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="font-body text-sm">Filter by category</span>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {CATEGORY_FILTERS.map((filter) => (
                            <Button
                                key={filter.value}
                                variant={selectedCategory === filter.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(filter.value)}
                                className={`font-body font-medium rounded-full transition-all duration-200 ${
                                    selectedCategory === filter.value
                                        ? 'bg-primary text-primary-foreground shadow-glow'
                                        : 'border-border text-foreground/70 hover:text-foreground hover:border-primary/50'
                                }`}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tasks Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-card">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                            No tasks found
                        </h3>
                        <p className="font-body text-sm text-muted-foreground max-w-xs">
                            {selectedCategory === 'all'
                                ? 'No tasks are available right now. Check back soon!'
                                : 'No tasks in this category. Try a different filter.'}
                        </p>
                        {selectedCategory !== 'all' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCategory('all')}
                                className="mt-4 font-body rounded-full"
                            >
                                Show All Tasks
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id.toString()}
                                task={task}
                                onClick={() => setSelectedTask(task)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <TaskDetailModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
            />
        </div>
    );
}
