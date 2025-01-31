import { useState, useEffect } from "react";
import { CalendarDay } from "../types";
import calendarData from "../data/calendar-data.json";

export const useCalendarData = () => {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsedDays = calendarData.days.map((day) => ({
        ...day,
        date: new Date(day.date),
      }));
      setDays(parsedDays);
      setLoading(false);
    } catch (err) {
      setError("Failed to load calendar data");
      setLoading(false);
    }
  }, []);

  return { days, loading, error };
};
