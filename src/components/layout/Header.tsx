'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils/utils';
import ConfirmationModal from '../shared/ConfirmationModal';

export default function Header() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);
        setShowLogoutConfirm(false);
        try {
            await logout();
            setMobileMenuOpen(false);
            // Success is indicated by the redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout fails, the AuthContext will handle cleanup and redirect
            // so we just need to reset our local state
            setMobileMenuOpen(false);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <Calendar className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-bold text-gray-900">EventBook</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                            >
                                Home
                            </Link>
                            <Link
                                href="/events"
                                className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                            >
                                Events
                            </Link>
                            {user && (
                                <Link
                                    href={`/dashboard/${user.role}`}
                                    className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center space-x-3">
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                        <User className="h-3 w-3 text-gray-500" />
                                        <span className="text-xs text-gray-700">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogoutClick}
                                        disabled={isLoggingOut}
                                        className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <LogOut className="h-3 w-3" />
                                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href="/auth/login"
                                        className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="btn btn-primary btn-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-1.5 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 py-3">
                            <nav className="flex flex-col space-y-3">
                                <Link
                                    href="/"
                                    className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/events"
                                    className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Events
                                </Link>
                                {user && (
                                    <Link
                                        href={`/dashboard/${user.role}`}
                                        className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                {user ? (
                                    <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                                        <div className="flex items-center space-x-2 text-xs text-gray-700">
                                            <User className="h-3 w-3" />
                                            <span>{user.name}</span>
                                        </div>
                                        <button
                                            onClick={handleLogoutClick}
                                            disabled={isLoggingOut}
                                            className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <LogOut className="h-3 w-3" />
                                            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                                        <Link
                                            href="/auth/login"
                                            className="text-gray-700 hover:text-blue-600 transition-colors text-sm"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="btn btn-primary btn-sm w-full justify-center"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to log in again to access your account."
                confirmText="Logout"
                cancelText="Cancel"
                variant="warning"
                loading={isLoggingOut}
            />
        </>
    );
} 