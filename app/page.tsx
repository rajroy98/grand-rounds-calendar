'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from '@/components/Calendar';
import EventFilters from '@/components/EventFilters';
import ChatWidget from '@/components/ChatWidget';
import { CalendarEvent } from '@/lib/calendar-service';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch events for the next 90 days to ensure calendar is populated
      const response = await fetch('/api/events?days=90');

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load calendar events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchEvents]);

  // Filter events by selected institutions
  useEffect(() => {
    if (selectedInstitutions.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) =>
          selectedInstitutions.includes(event.institution || 'Unknown Institution')
        )
      );
    }
  }, [events, selectedInstitutions]);

  // Get unique institutions from events
  const institutions = Array.from(
    new Set(events.map((event) => event.institution || 'Unknown Institution'))
  ).sort();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Surgery Grand Rounds Collaborative
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collaborative hub for surgery grand rounds across premier institutions.
            Stay updated with real-time event schedules.
          </p>

          {/* Status Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 text-blue-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="font-medium">{loading ? 'Syncing...' : 'Refresh Calendar'}</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>

            {error && (
              <div className="px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Institutions
              </h2>
              <EventFilters
                institutions={institutions}
                selectedInstitutions={selectedInstitutions}
                onSelectionChange={setSelectedInstitutions}
              />
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500">
                  Showing {filteredEvents.length} of {events.length} events
                </p>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6 min-h-[800px]">
              {loading && events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[600px] animate-pulse">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading schedule...</p>
                </div>
              ) : error && events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[600px]">
                  <div className="text-center max-w-md mx-auto p-8 rounded-2xl bg-red-50 dark:bg-red-900/10">
                    <p className="text-red-600 dark:text-red-400 mb-6 text-lg">{error}</p>
                    <button
                      onClick={fetchEvents}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <Calendar events={filteredEvents} />
              )}
            </div>
          </div>
        </div>
      </div>
      <ChatWidget />
    </main>
  );
}

