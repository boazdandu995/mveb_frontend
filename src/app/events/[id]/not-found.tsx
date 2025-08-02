import Link from 'next/link';
import { ArrowLeft, Calendar, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        Sorry, the event you're looking for doesn't exist or may have been removed.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/events"
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Browse All Events
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Search Events
                    </Link>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    <p>If you believe this is an error, please contact support.</p>
                </div>
            </div>
        </div>
    );
} 