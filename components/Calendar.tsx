'use client';

import { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '@/lib/calendar-service';
import EventModal from './EventModal';

const localizer = momentLocalizer(moment);

interface CalendarProps {
  events: CalendarEvent[];
}

export default function Calendar({ events }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Transform events for react-big-calendar
  const calendarEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      title: `${event.title} - ${event.institution}`,
      start: event.start,
      end: event.end,
    }));
  }, [events]);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event as CalendarEvent);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Custom event style
  const eventStyleGetter = (event: any) => {
    // Color code by institution (simple hash-based coloring)
    const institution = event.institution || 'Unknown';
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#84cc16', // lime
    ];

    const hash = institution.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];

    return {
      style: {
        backgroundColor: color,
        borderColor: color,
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px',
        fontSize: '12px',
      },
    };
  };

  return (
    <>
      <div className="h-[700px]">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          popup
          showMultiDayTimes
          step={60}
          defaultDate={new Date()}
          formats={{
            dayFormat: 'ddd M/D',
            weekdayFormat: 'ddd',
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'dddd, MMMM D',
            dayRangeHeaderFormat: ({ start, end }: any) =>
              `${moment(start).format('MMM D')} - ${moment(end).format('MMM D, YYYY')}`,
          }}
        />
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </>
  );
}

