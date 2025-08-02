'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Building } from 'lucide-react';
import { RegisterSchema, initialRegisterValues } from '../../../lib/utils/validations';
import PublicRoute from '../../../components/shared/PublicRoute';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'user' | 'vendor';
}

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (values: RegisterFormData, { setSubmitting }: any) => {
        setLoading(true);
        setError('');

        try {
            const response = await register(values.email, values.password, values.name, values.role);

            // Redirect to appropriate dashboard based on user role
            switch (response.user.role) {
                case 'admin':
                    router.push('/dashboard/admin');
                    break;
                case 'vendor':
                    router.push('/dashboard/vendor');
                    break;
                default:
                    router.push('/dashboard/user');
            }
        } catch (error: any) {
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <PublicRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join us and start exploring amazing events
                        </p>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <Formik
                            initialValues={initialRegisterValues}
                            validationSchema={RegisterSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                                <Form className="space-y-6">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <div className="mt-1 relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Field
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="name"
                                                className={`input pl-10 ${errors.name && touched.name ? 'border-red-300' : ''
                                                    }`}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                                    </div>

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
                                                autoComplete="new-password"
                                                className={`input pl-10 pr-10 ${errors.password && touched.password ? 'border-red-300' : ''
                                                    }`}
                                                placeholder="Create a password"
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
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </label>
                                        <div className="mt-1 relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Field
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                className={`input pl-10 pr-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300' : ''
                                                    }`}
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
                                    </div>

                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                            Account Type
                                        </label>
                                        <div className="mt-1 relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Building className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Field
                                                as="select"
                                                id="role"
                                                name="role"
                                                className={`input pl-10 ${errors.role && touched.role ? 'border-red-300' : ''
                                                    }`}
                                            >
                                                <option value="">Select account type</option>
                                                <option value="user">Regular User</option>
                                                <option value="vendor">Vendor/Event Organizer</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage name="role" component="p" className="mt-1 text-sm text-red-600" />
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading || isSubmitting}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Creating account...' : 'Create account'}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Already have an account?{' '}
                                            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                                                Sign in here
                                            </Link>
                                        </p>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </PublicRoute>
    );
} 