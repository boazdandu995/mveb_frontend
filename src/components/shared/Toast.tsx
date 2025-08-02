'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/store/hooks';
import { removeNotification } from '../../redux/slices/uiSlice';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(state => state.ui.notifications);

    useEffect(() => {
        notifications.forEach(notification => {
            if (notification.duration) {
                const timer = setTimeout(() => {
                    dispatch(removeNotification(notification.id));
                }, notification.duration);

                return () => clearTimeout(timer);
            }
        });
    }, [notifications, dispatch]);

    const getToastStyles = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-800',
                    icon: CheckCircle,
                    iconColor: 'text-green-600'
                };
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-800',
                    icon: XCircle,
                    iconColor: 'text-red-600'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    text: 'text-yellow-800',
                    icon: AlertCircle,
                    iconColor: 'text-yellow-600'
                };
            case 'info':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    icon: Info,
                    iconColor: 'text-blue-600'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    text: 'text-gray-800',
                    icon: Info,
                    iconColor: 'text-gray-600'
                };
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => {
                const styles = getToastStyles(notification.type);
                const IconComponent = styles.icon;

                return (
                    <div
                        key={notification.id}
                        className={`${styles.bg} ${styles.border} border-l-4 p-4 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out`}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <IconComponent className={`h-5 w-5 ${styles.iconColor}`} />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className={`text-sm font-medium ${styles.text}`}>
                                    {notification.message}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <button
                                    onClick={() => dispatch(removeNotification(notification.id))}
                                    className={`inline-flex rounded-md p-1.5 ${styles.bg} ${styles.text} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 