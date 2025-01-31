import { useState, useEffect } from 'react';
import { Event } from '../types';
import eventsData from '../data/events.json';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsedEvents = eventsData.events.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(parsedEvents);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events data');
      setLoading(false);
    }
  }, []);

  return { events, loading, error };
};