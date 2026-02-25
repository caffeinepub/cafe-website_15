import { useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile } from './useQueries';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
    const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
    const queryClient = useQueryClient();

    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';

    const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

    const handleLogin = async () => {
        try {
            await login();
        } catch (error: unknown) {
            const err = error as Error;
            if (err?.message === 'User is already authenticated') {
                await clear();
                setTimeout(() => login(), 300);
            }
        }
    };

    const handleLogout = async () => {
        await clear();
        queryClient.clear();
    };

    const showProfileSetup =
        isAuthenticated &&
        !profileLoading &&
        profileFetched &&
        userProfile === null;

    return {
        identity,
        isAuthenticated,
        isLoggingIn,
        isInitializing,
        userProfile,
        profileLoading,
        profileFetched,
        showProfileSetup,
        login: handleLogin,
        logout: handleLogout,
    };
}
