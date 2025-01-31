export interface Event {
  date: Date;
  title: string;
  type: "anniversary" | "exam" | "event";
}

export interface CalendarDay {
  date: Date;
  id: number;
}
