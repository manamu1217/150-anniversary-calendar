export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  return date > today;
};

export const getDaysUntil = (startDate: Date, targetDate: Date): number => {
  const diffTime = targetDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
};
