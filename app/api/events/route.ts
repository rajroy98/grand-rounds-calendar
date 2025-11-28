import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/lib/calendar-service';

const calendarService = new CalendarService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const days = searchParams.get('days');

    let events;

    if (startDate && endDate) {
      // Get events for specific date range
      events = await calendarService.getEventsForRange(
        new Date(startDate),
        new Date(endDate)
      );
    } else if (days) {
      // Get upcoming events for specified number of days
      events = await calendarService.getUpcomingEvents(parseInt(days));
    } else {
      // Default: get upcoming events for next 30 days
      events = await calendarService.getUpcomingEvents(30);
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// Enable revalidation for real-time updates
export const revalidate = 300; // Revalidate every 5 minutes

