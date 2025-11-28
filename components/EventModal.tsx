'use client';

import { CalendarEvent } from '@/lib/calendar-service';
import { X, MapPin, Calendar, User, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h2>
            {event.institution && (
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {event.institution}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(event.start)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatTime(event.start)} - {formatTime(event.end)}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-gray-900 dark:text-white">{event.location}</p>
              </div>
            </div>
          )}

          {/* Organizer */}
          {event.organizer && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Organizer</p>
                <p className="text-gray-900 dark:text-white">{event.organizer}</p>
              </div>
            </div>
          )}

          {/* Zoom Link */}
          {event.zoomLink && (
            <div className="pt-2">
              <a
                href={event.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Join Zoom Meeting
              </a>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
              <div
                className="text-gray-900 dark:text-white prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br />') }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

