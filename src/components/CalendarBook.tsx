import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { useCalendarData } from "../hooks/useCalendarData";
import Calendar from "./Calendar";

// 日付データの型
type Day = {
  id: number;
  date: Date;
};

// 画面サイズ情報の型
type Dimensions = {
  isMobile: boolean;
  width: number;
  height: number;
};

const Book: React.FC = () => {
  const { loading, error } = useCalendarData();
  const [days, setDays] = useState<Day[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dimensions, setDimensions] = useState<Dimensions>({
    isMobile: false,
    width: 0,
    height: 0,
  });

  // Add a container ref to measure actual available space
  const containerRef = useRef<HTMLDivElement>(null);

  // Improved dimensions calculation with minimum sizes and container-based measurement
  useEffect(() => {
    const updateDimensions = (): void => {
      // Ensure we have a valid container to measure
      if (!containerRef.current) return;

      // Get container dimensions for more accurate sizing
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Determine if mobile based on container width rather than window
      const isMobile = rect.width < 768;

      // Set minimum dimensions to ensure visibility
      const minWidth = 300;
      const minHeight = 400;

      // Calculate dimensions, ensuring they're never smaller than minimums
      const width = Math.max(minWidth, isMobile ? rect.width : rect.width / 2);

      const height = Math.max(
        minHeight,
        // Use 90% of available height for better visibility
        rect.height * 1.0
      );

      setDimensions({
        isMobile,
        width,
        height,
      });
    };

    // Initial call after a short delay to ensure container is rendered
    const timer = setTimeout(() => {
      updateDimensions();
    }, 100);

    // Add event listener
    window.addEventListener("resize", updateDimensions);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (days.length === 0) {
      const baseDate: Date = new Date(2024, 0, 1);
      const today: Date = new Date();
      const diffDays: number = Math.floor(
        (today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const newDays: Day[] = [];
      for (let i = diffDays - 20; i <= diffDays; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        newDays.push({ id: i, date });
      }

      setDays(newDays);
      setCurrentIndex(newDays.length - 1);
    }
  }, []);

  const getAdditionalDays = (): void => {
    if (days.length === 0) return;
    const currentId: number = days[0].id;
    const baseDate: Date = new Date(2024, 0, 1);
    const date: Date = new Date(baseDate);
    date.setDate(date.getDate() + currentId - 1);

    const newDay: Day = { id: currentId - 1, date };
    setDays((prevDays) => [newDay, ...prevDays]);
    setCurrentIndex(0);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const handlePrevDay = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      getAdditionalDays();
    }
  };

  const handleNextDay = (): void => {
    const today: Date = new Date();
    const currentDate: Date | undefined = days[currentIndex]?.date;

    if (
      currentDate &&
      currentIndex < days.length - 1 &&
      days[currentIndex + 1].date <= today
    ) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Improved loading display with min-height to prevent flicker
  if (loading || days.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Calculate the correct start page
  const startPage = dimensions.isMobile
    ? Math.max(0, days.length - 2)
    : Math.max(0, 2 * Math.floor((days.length - 1) / 2));

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center w-full min-h-screen"
    >
      {days.length > 0 && dimensions.width > 0 && (
        <div className="w-full h-full flex justify-center items-center">
          <HTMLFlipBook
            key={`${dimensions.width}-${dimensions.height}`}
            width={dimensions.width}
            height={dimensions.height}
            startPage={startPage}
            className="flipbook-container"
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            drawShadow={true}
            // Force re-render when dimensions change significantly
            size="fixed"
          >
            {days.flatMap((day) => {
              const elements = [];

              // Only add cover for desktop
              if (!dimensions.isMobile) {
                elements.push(
                  <div
                    className="flex flex-col items-center justify-center w-full h-full bg-white"
                    key={`cover-${day.id}`}
                  >
                    <h1 className="flex flex-col items-center justify-center text-black-600 text-2xl md:text-4xl font-medium h-full font-yuji">
                      <img
                        src="/icon/doshisha_calender.png"
                        className="size-60"
                        alt="Doshisha Calendar"
                      />
                    </h1>
                  </div>
                );
              }

              // Always add the calendar page
              elements.push(
                <div key={`calendar-${day.id}`} className="demoPage">
                  <Calendar
                    currentDay={day}
                    onPrevDay={handlePrevDay}
                    onNextDay={handleNextDay}
                    loading={loading}
                  />
                </div>
              );

              return elements;
            })}
          </HTMLFlipBook>
        </div>
      )}
    </div>
  );
};

export default Book;
