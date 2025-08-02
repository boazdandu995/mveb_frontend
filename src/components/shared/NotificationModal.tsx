'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function NotificationModal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    autoClose = true,
    autoCloseDelay = 3000
}: NotificationModalProps) {
    if (!isOpen) return null;

    // Auto-close functionality
    React.useEffect(() => {
        if (autoClose && isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle,
                    iconColor: 'text-green-600',
                    bg: 'bg-green-50',
                    border: 'border-green-200'
                };
            case 'error':
                return {
                    icon: XCircle,
                    iconColor: 'text-red-600',
                    bg: 'bg-red-50',
                    border: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: AlertCircle,
                    iconColor: 'text-yellow-600',
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200'
                };
            case 'info':
                return {
                    icon: Info,
                    iconColor: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200'
                };
            default:
                return {
                    icon: Info,
                    iconColor: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200'
                };
        }
    };

    const styles = getTypeStyles();
    const IconComponent = styles.icon;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className={`${styles.bg} ${styles.border} border-l-4 px-4 py-3`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <IconComponent className={`h-5 w-5 ${styles.iconColor}`} />
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-gray-900">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-700">
                                        {message}
                                    </p>
                                </div>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        onClick={onClose}
                                        className={`inline-flex rounded-md p-1.5 ${styles.bg} text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 