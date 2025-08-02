import type { Metadata } from 'next';
import '../styles/globals.css';
import { Providers } from '../config/providers';
import Header from '../components/layout/Header';
import ConditionalFooter from '../components/layout/ConditionalFooter';

export const metadata: Metadata = {
  title: 'EventBook - Multi-Vendor Event Booking Platform',
  description: 'Book tickets to the best events from trusted vendors. From concerts to conferences, find your next unforgettable experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-12">
              {children}
            </main>
            <ConditionalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
