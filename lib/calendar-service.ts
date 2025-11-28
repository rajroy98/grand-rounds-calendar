import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  zoomLink?: string;
  institution?: string;
  organizer?: string;
}

export class CalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: any;

  constructor() {
    // Initialize OAuth2 client
    // These will be set via environment variables
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
    );

    // Set credentials if we have a refresh token
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
    }

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Extract institution name from event title or description
   */
  private extractInstitution(event: any): string {
    const title = event.summary || '';
    const description = event.description || '';
    const location = event.location || '';
    
    // Common patterns to identify institutions
    // You can customize this based on how institutions name their events
    const institutionPatterns = [
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Grand\s+Rounds?|Surgery\s+Grand\s+Rounds?)/i,
      /Grand\s+Rounds?[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+Medical\s+Center/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+Hospital/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+University/i,
    ];

    for (const pattern of institutionPatterns) {
      const match = title.match(pattern) || description.match(pattern) || location.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback: try to extract from organizer email
    if (event.organizer?.email) {
      const emailDomain = event.organizer.email.split('@')[1];
      if (emailDomain && !emailDomain.includes('gmail.com')) {
        return emailDomain.split('.')[0]
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    return 'Unknown Institution';
  }

  /**
   * Extract Zoom link from event description
   */
  private extractZoomLink(description: string): string | undefined {
    if (!description) return undefined;

    const zoomPatterns = [
      /https?:\/\/[^\s]*zoom\.us\/[^\s]*/i,
      /https?:\/\/[^\s]*zoom\.us\/j\/[^\s]*/i,
      /zoom\.us\/j\/[\d]+/i,
      /Meeting ID:[\s]*[\d\s]+/i,
    ];

    for (const pattern of zoomPatterns) {
      const match = description.match(pattern);
      if (match) {
        let link = match[0];
        // If it's just a meeting ID, construct the full URL
        if (link.includes('Meeting ID:')) {
          const meetingId = link.replace(/Meeting ID:\s*/i, '').replace(/\s/g, '');
          return `https://zoom.us/j/${meetingId}`;
        }
        // Ensure it's a full URL
        if (!link.startsWith('http')) {
          link = `https://${link}`;
        }
        return link;
      }
    }

    return undefined;
  }

  /**
   * Fetch events from Google Calendar
   */
  async getEvents(
    timeMin?: Date,
    timeMax?: Date,
    maxResults: number = 250
  ): Promise<CalendarEvent[]> {
    try {
      // Use the calendar email from environment or default
      const calendarId = process.env.GOOGLE_CALENDAR_EMAIL || 'rajroy121998@gmail.com';

      const response = await this.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin?.toISOString() || new Date().toISOString(),
        timeMax: timeMax?.toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      return events
        .filter((event: any) => event.start && !event.start.date) // Only timed events, not all-day
        .map((event: any) => {
          const start = new Date(event.start.dateTime);
          const end = new Date(event.end.dateTime);
          const description = event.description || '';
          
          return {
            id: event.id,
            title: event.summary || 'Untitled Event',
            start,
            end,
            description,
            location: event.location,
            zoomLink: this.extractZoomLink(description),
            institution: this.extractInstitution(event),
            organizer: event.organizer?.email || event.organizer?.displayName,
          };
        });
    } catch (error: any) {
      console.error('Error fetching calendar events:', error);
      throw new Error(`Failed to fetch calendar events: ${error.message}`);
    }
  }

  /**
   * Get upcoming events (next 30 days)
   */
  async getUpcomingEvents(days: number = 30): Promise<CalendarEvent[]> {
    const timeMin = new Date();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + days);

    return this.getEvents(timeMin, timeMax);
  }

  /**
   * Get events for a specific date range
   */
  async getEventsForRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return this.getEvents(startDate, endDate);
  }
}

