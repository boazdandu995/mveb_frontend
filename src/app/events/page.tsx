"use client";

import { useState, useMemo, useEffect } from "react";
import { useEvents, useUserEvents } from "../../hooks/common/useEvents";
import { useEventsSearch } from "../../hooks/api/useEventsApi";
import { useAuth } from "../../context/AuthContext";
import EventCard from "../../components/features/events/EventCard";
import Pagination from "../../components/shared/Pagination";
import { Search, Filter, Grid, List, ChevronDown, Loader2, Calendar, MapPin } from "lucide-react";

const categories = [
    "Music",
    "Technology",
    "Food & Drink",
    "Arts & Culture",
    "Sports",
    "Business",
    "Education",
    "Health",
];

const locations = [
    "New York",
    "San Francisco",
    "Los Angeles",
    "Miami",
    "Chicago",
    "Austin",
    "Seattle",
    "Boston",
];

const PRICE_MIN = 0;
const PRICE_MAX = 500;

export default function EventsPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [price, setPrice] = useState([PRICE_MIN, PRICE_MAX]);
    const [sort, setSort] = useState("date");
    const [view, setView] = useState("grid");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [vendorSearch, setVendorSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // Determine if we should use search or regular events API
    const hasSearchFilters = search || vendorSearch || dateRange.start || dateRange.end ||
        selectedCategories.length > 0 || selectedLocations.length > 0;

    // Get paginated events from API
    const { data: eventsResponse, isLoading: eventsLoading, error: eventsError } = useEvents(
        hasSearchFilters ? {
            query: search || undefined,
            category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
            location: selectedLocations.length === 1 ? selectedLocations[0] : undefined,
            dateFrom: dateRange.start || undefined,
            dateTo: dateRange.end || undefined,
        } : undefined,
        { page: currentPage, limit: itemsPerPage }
    );

    // Get user events for booking status (no pagination needed)
    const { data: userEvents = [], isLoading: userEventsLoading, error: userEventsError } = useUserEvents();

    // Extract data from paginated response
    const events = eventsResponse?.data || [];
    const paginationInfo = eventsResponse ? {
        total: eventsResponse.total,
        page: eventsResponse.page,
        limit: eventsResponse.limit,
        totalPages: eventsResponse.totalPages,
    } : null;

    // Merge with user booking status if available
    const eventsWithUserStatus = events.map(event => {
        if (user && !userEventsError && userEvents.length > 0) {
            const userEvent = userEvents.find(ue => ue.id === event.id);
            if (userEvent) {
                return { ...event, userHasBooked: userEvent.userHasBooked };
            }
        }
        return event;
    });

    const isLoading = eventsLoading || (user && userEventsLoading);
    const error = eventsError;

    // Client-side filtering logic (for cases not handled by backend)
    const filteredEvents = useMemo(() => {
        let filteredEvents = [...eventsWithUserStatus];

        // Client-side filtering for multiple categories/locations (backend handles single category/location)
        if (selectedCategories.length > 1) {
            filteredEvents = filteredEvents.filter((e) => selectedCategories.includes(e.category));
        }

        if (selectedLocations.length > 1) {
            filteredEvents = filteredEvents.filter((e) =>
                selectedLocations.some((loc) => e.location.includes(loc))
            );
        }

        // Price filtering (not handled by backend yet)
        filteredEvents = filteredEvents.filter((e) => {
            if (e.ticketPrice === undefined || e.ticketPrice === null) return true;
            return e.ticketPrice >= price[0] && e.ticketPrice <= price[1];
        });

        // Vendor search filtering (client-side for now)
        if (vendorSearch) {
            filteredEvents = filteredEvents.filter((e) =>
                e.vendor?.vendorName?.toLowerCase().includes(vendorSearch.toLowerCase())
            );
        }

        // Sorting (client-side for now)
        if (sort === "date") {
            filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (sort === "price-asc") {
            filteredEvents.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0));
        } else if (sort === "price-desc") {
            filteredEvents.sort((a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0));
        }

        return filteredEvents;
    }, [eventsWithUserStatus, selectedCategories, selectedLocations, price, sort, vendorSearch]);

    // Handlers
    const handleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleLocation = (loc: string) => {
        setSelectedLocations((prev) =>
            prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
        );
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handlePrice = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = Number(e.target.value);
        setPrice((prev) =>
            idx === 0 ? [val, prev[1]] : [prev[0], val]
        );
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handleVendorSearch = (value: string) => {
        setVendorSearch(value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
        setDateRange(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of events section
        document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedLocations([]);
        setPrice([PRICE_MIN, PRICE_MAX]);
        setSearch("");
        setVendorSearch("");
        setDateRange({ start: "", end: "" });
        setSort("date");
        setCurrentPage(1); // Reset to first page when clearing filters
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Events</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                {/* Sidebar */}
                <aside className="w-80 hidden lg:block">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                        <h2 className="text-lg font-semibold mb-6">Filters</h2>

                        {/* Search by Title */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Search by Title</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Event title..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="input pl-10 w-full text-sm"
                                />
                            </div>
                        </div>

                        {/* Search by Vendor */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Search by Vendor</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Vendor name..."
                                    value={vendorSearch}
                                    onChange={(e) => handleVendorSearch(e.target.value)}
                                    className="input pl-10 w-full text-sm"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Date Range</h3>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                                        className="input pl-10 w-full text-sm"
                                        placeholder="Start date"
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                                        className="input pl-10 w-full text-sm"
                                        placeholder="End date"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Categories</h3>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {categories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategory(cat)}
                                            className="accent-blue-600"
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Locations</h3>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {locations.map((loc) => (
                                    <label key={loc} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={selectedLocations.includes(loc)}
                                            onChange={() => handleLocation(loc)}
                                            className="accent-blue-600"
                                        />
                                        {loc}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={PRICE_MIN}
                                    max={price[1]}
                                    value={price[0]}
                                    onChange={(e) => handlePrice(e, 0)}
                                    className="input w-20 text-center text-sm"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    min={price[0]}
                                    max={PRICE_MAX}
                                    value={price[1]}
                                    onChange={(e) => handlePrice(e, 1)}
                                    className="input w-20 text-center text-sm"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>${PRICE_MIN}</span>
                                <span>${PRICE_MAX}+</span>
                            </div>
                        </div>

                        <button onClick={clearFilters} className="btn btn-outline btn-sm w-full mt-2">
                            Clear Filters
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div className="flex-1 flex items-center relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="input pl-10 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="input input-sm w-32"
                            >
                                <option value="date">Date</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                            <button
                                className={`p-1.5 rounded-md border ${view === "grid" ? "bg-blue-50 border-blue-600" : "bg-white border-gray-200"}`}
                                onClick={() => setView("grid")}
                                aria-label="Grid view"
                            >
                                <Grid className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                                className={`p-1.5 rounded-md border ${view === "list" ? "bg-blue-50 border-blue-600" : "bg-white border-gray-200"}`}
                                onClick={() => setView("list")}
                                aria-label="List view"
                            >
                                <List className="h-4 w-4 text-blue-600" />
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-24">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
                            <p className="text-gray-600">Loading events...</p>
                        </div>
                    )}

                    {/* Results Count */}
                    {!isLoading && paginationInfo && (
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Events</h2>
                            <span className="text-gray-500 text-sm">
                                {paginationInfo.total} event{paginationInfo.total !== 1 ? "s" : ""} found
                                {filteredEvents.length !== events.length && (
                                    <span className="ml-2 text-gray-400">
                                        ({filteredEvents.length} after filters)
                                    </span>
                                )}
                            </span>
                        </div>
                    )}

                    {/* Events Grid/List */}
                    {!isLoading && filteredEvents.length > 0 ? (
                        <>
                            <div
                                className={
                                    view === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
                                        : "flex flex-col gap-4"
                                }
                            >
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {paginationInfo && paginationInfo.totalPages > 1 && (
                                <Pagination
                                    currentPage={paginationInfo.page}
                                    totalPages={paginationInfo.totalPages}
                                    totalItems={paginationInfo.total}
                                    itemsPerPage={paginationInfo.limit}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    ) : !isLoading && (
                        <div className="text-center py-24">
                            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-600 mb-4">
                                {events.length === 0
                                    ? "No events are currently available. Check back later!"
                                    : "Try adjusting your search or filters."
                                }
                            </p>
                            {events.length > 0 && (
                                <button onClick={clearFilters} className="btn btn-primary btn-sm">Clear All Filters</button>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
} 