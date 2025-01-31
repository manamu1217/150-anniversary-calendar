import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { getDaysUntil } from '../utils/dateUtils';

const CountdownTimer: React.FC = () => {
  const { events, loading } = useEvents();

  if (loading) return null;

  const doshishaEvent = events.find(event => event.title === '同志社創立150周年');
  const otherEvents = events.filter(event => event.title !== '同志社創立150周年');

  const upcomingEvents = [
    // Always include Doshisha anniversary if it's in the future
    ...(doshishaEvent && getDaysUntil(doshishaEvent.date) > 0
      ? [{ ...doshishaEvent, daysUntil: getDaysUntil(doshishaEvent.date) }]
      : []),
    // Other events only within 30 days
    ...otherEvents
      .map(event => ({
        ...event,
        daysUntil: getDaysUntil(event.date)
      }))
      .filter(event => event.daysUntil <= 30 && event.daysUntil > 0)
  ].sort((a, b) => {
    // Always show Doshisha 150th anniversary first
    if (a.title === '同志社創立150周年') return -1;
    if (b.title === '同志社創立150周年') return 1;
    return a.daysUntil - b.daysUntil;
  });

  if (upcomingEvents.length === 0) return null;

  return (
    <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md">
      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 space-y-2 text-white">
        {upcomingEvents.map((event) => (
          <div
            key={event.title}
            className={`flex items-center justify-between space-x-4 text-sm md:text-base ${
              event.title === '同志社創立150周年' ? 'text-yellow-300 font-bold' : ''
            }`}
          >
            <span className="font-medium">{event.title}</span>
            <span className={event.title === '同志社創立150周年' ? 'text-yellow-300' : 'text-red-400'}>
              {event.daysUntil}日後
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;