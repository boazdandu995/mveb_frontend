'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { LoginSchema, initialLoginValues } from '../../../lib/utils/validations';
import PublicRoute from '../../../components/shared/PublicRoute';

interface LoginFormData {
    email: string;
    password: string;
}

// Component that handles search params with Suspense
function LoginFormWithParams() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const redirect = searchParams.get('redirect');
        if (redirect) {
            setRedirectUrl(redirect);
        }
    }, [searchParams]);

    const handleSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
        setLoading(true);
        setError('');

        try {
            const user = await login(values.email, values.password);

            // If there's a redirect URL, go there first
            if (redirectUrl) {
                // Use replace to avoid adding to browser history
                router.replace(redirectUrl);
                return;
            }

            // Redirect to appropriate dashboard based on user role
            switch (user.role) {
                case 'admin':
                    router.replace('/dashboard/admin');
                    break;
                case 'vendor':
                    router.replace('/dashboard/vendor');
                    break;
                default:
                    router.replace('/dashboard/user');
            }
        } catch (error: any) {
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Formik
                        initialValues={initialLoginValues}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className={`input pl-10 ${errors.email && touched.email ? 'border-red-300' : ''
                                                }`}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Field
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            className={`input pl-10 pr-10 ${errors.password && touched.password ? 'border-red-300' : ''
                                                }`}
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading || isSubmitting}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                                            Sign up here
                                        </Link>
                                    </p>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <PublicRoute>
            <Suspense fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            }>
                <LoginFormWithParams />
            </Suspense>
        </PublicRoute>
    );
} 