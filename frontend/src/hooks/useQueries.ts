import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Task, type TaskCompletion, type UserProfile } from '../backend';

export function useListAvailableTasks() {
    const { actor, isFetching } = useActor();

    return useQuery<Task[]>({
        queryKey: ['availableTasks'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.listAvailableTasks();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetMyCompletions() {
    const { actor, isFetching } = useActor();

    return useQuery<TaskCompletion[]>({
        queryKey: ['myCompletions'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getMyCompletions();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetMyBalance() {
    const { actor, isFetching } = useActor();

    return useQuery<bigint>({
        queryKey: ['myBalance'],
        queryFn: async () => {
            if (!actor) return BigInt(0);
            return actor.getMyBalance();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useSubmitTaskCompletion() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId: bigint) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.submitTaskCompletion(taskId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['availableTasks'] });
            queryClient.invalidateQueries({ queryKey: ['myCompletions'] });
            queryClient.invalidateQueries({ queryKey: ['myBalance'] });
        },
    });
}

export function useRequestWithdrawal() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (amount: bigint) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.requestWithdrawal(amount);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myBalance'] });
        },
    });
}

export function useRegisterUser() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (username: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.registerUser(username);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
            queryClient.invalidateQueries({ queryKey: ['myBalance'] });
        },
    });
}

export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();

    const query = useQuery<UserProfile | null>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}

export function useSubmitContactForm() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async ({ name, email, message }: { name: string; email: string; message: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.submitContactForm(name, email, message);
        },
    });
}
