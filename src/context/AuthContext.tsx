'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthResponse } from '../types/types';
import { useLogin, useRegister, useLogout } from '../hooks/api/useAuthApi';

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof window === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    // Encode the value to handle special characters in JSON
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            const value = c.substring(nameEQ.length, c.length);
            // Try to decode the value if it was encoded
            try {
                return decodeURIComponent(value);
            } catch {
                return value; // Return original value if decoding fails
            }
        }
    }
    return null;
};

const deleteCookie = (name: string) => {
    if (typeof window === 'undefined') return;
    // Clear both encoded and non-encoded versions to ensure complete cleanup
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
};

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (email: string, password: string, name: string, role: 'user' | 'vendor' | 'admin') => Promise<{ message: string; user: User }>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // React Query hooks
    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const logoutMutation = useLogout();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check both localStorage and cookies for backward compatibility
                const localStorageToken = localStorage.getItem('auth_token');
                const cookieToken = getCookie('auth_token');
                const token = localStorageToken || cookieToken;

                console.log('🔍 AuthContext - localStorage token:', !!localStorageToken);
                console.log('🔍 AuthContext - cookie token:', !!cookieToken);
                console.log('🔍 AuthContext - final token:', !!token);

                if (token) {
                    const localStorageUser = localStorage.getItem('user_data');
                    const cookieUser = getCookie('user_data');
                    const userData = localStorageUser || cookieUser;

                    console.log('🔍 AuthContext - localStorage user:', !!localStorageUser);
                    console.log('🔍 AuthContext - cookie user:', !!cookieUser);

                    if (userData) {
                        const user = JSON.parse(userData);
                        console.log('🔍 Current user:', user);
                        console.log('🔍 User role:', user.role);
                        setUser(user);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                deleteCookie('auth_token');
                deleteCookie('user_data');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<User> => {
        try {
            const response: AuthResponse = await loginMutation.mutateAsync({ email, password });
            setUser(response.user);

            // Store in both localStorage and cookies for compatibility
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.access_token || '');
                localStorage.setItem('user_data', JSON.stringify(response.user));
                setCookie('auth_token', response.access_token || '', 7);
                setCookie('user_data', JSON.stringify(response.user), 7);
            }

            return response.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string, role: 'user' | 'vendor' | 'admin') => {
        try {
            const response = await registerMutation.mutateAsync({ email, password, name, role });
            // Set user after successful registration
            setUser(response.user);

            // Store in both localStorage and cookies for compatibility
            if (typeof window !== 'undefined' && response.access_token) {
                localStorage.setItem('auth_token', response.access_token);
                localStorage.setItem('user_data', JSON.stringify(response.user));
                setCookie('auth_token', response.access_token, 7);
                setCookie('user_data', JSON.stringify(response.user), 7);
            }

            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };



    const logout = async (): Promise<void> => {
        console.log('🔄 Starting logout process...');

        try {
            // First, call the backend logout endpoint (if token exists)
            const hasToken = localStorage.getItem('auth_token') || getCookie('auth_token');
            if (hasToken) {
                try {
                    await logoutMutation.mutateAsync();
                    console.log('✅ Backend logout completed');
                } catch (error) {
                    console.error('❌ Backend logout failed:', error);
                    // Continue with local cleanup even if backend fails
                }
            }

            // Clear user state and storage
            setUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            deleteCookie('auth_token');
            deleteCookie('user_data');

            console.log('✅ User state and storage cleared');

            // Navigate to login page
            router.push('/auth/login');
            console.log('✅ Redirected to login page');
            
        } catch (error) {
            console.error('❌ Logout process failed:', error);
            
            // Even if something fails, ensure we clear local state and redirect
            setUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            deleteCookie('auth_token');
            deleteCookie('user_data');
            router.push('/auth/login');
        }

        console.log('🏁 Logout process completed');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);

            // Update both localStorage and cookies
            if (typeof window !== 'undefined') {
                localStorage.setItem('user_data', JSON.stringify(updatedUser));
                setCookie('user_data', JSON.stringify(updatedUser), 7);
            }
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 