import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EventDetailClient from './EventDetailClient';

// Use Incremental Static Regeneration (ISR) for on-demand page generation
// Pages will be generated when first visited and cached for 1 hour
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

// Generate metadata for each event
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Add timeout to prevent hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      };
    }

    const event = await response.json();

    return {
      title: `${event.title} - Event Details`,
      description: event.description?.substring(0, 160) || `Join us for ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
      openGraph: {
        title: event.title,
        description: event.description?.substring(0, 160) || `Join us for ${event.title}`,
        type: 'article',
        images: event.image ? [event.image] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: event.description?.substring(0, 160) || `Join us for ${event.title}`,
        images: event.image ? [event.image] : [],
      },
    };
  } catch (error) {
    console.warn('Error generating metadata:', error);
    return {
      title: 'Event Details',
      description: 'Event information and booking details.',
    };
  }
}

// Server component that fetches event data
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Add timeout to prevent hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Event not found (${response.status}): ${id}`);
      notFound();
    }

    const event = await response.json();

    return <EventDetailClient event={event} />;
  } catch (error) {
    console.error('Error fetching event:', error);
    notFound();
  }
} 