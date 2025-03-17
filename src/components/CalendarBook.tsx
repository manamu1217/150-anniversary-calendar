import React, { useEffect, useState } from "react";
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
    isMobile: window.innerWidth < 768,
    width: window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 2,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateDimensions = (): void => {
      const isMobile = window.innerWidth < 768;
      setDimensions({
        isMobile,
        width: isMobile ? window.innerWidth : window.innerWidth / 2,
        height: window.innerHeight,
      });
    };
    console.log(dimensions);

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
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

    if (currentDate && currentIndex < days.length - 1 && days[currentIndex + 1].date <= today) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading || days.length === 0 || dimensions === null) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      {days.length > 0 && (
        <HTMLFlipBook
          key={`${dimensions.width}-${dimensions.height}`}
          width={dimensions.width}
          height={dimensions.height}
          startPage={
            dimensions.isMobile
              ? Math.max(0, days.length - 2)
              : Math.max(0, 2 * (days.length - 1) - 1)
          }
          className="flipbook-container"
          maxShadowOpacity={0.5}
          mobileScrollSupport={true}
          drawShadow={true}
        >
          {days.flatMap((day) =>
            [
              !dimensions.isMobile ? (
                <div
                  className="flex flex-col items-center justify-center w-full h-full bg-white"
                  key={`cover-${day.id}`}
                >
                  <h1 className="flex flex-col items-center justify-center text-black-600 text-2xl md:text-4xl font-medium h-full font-yuji">
                    <img src="/icon/doshisha_calender.png" className="size-60" />
                  </h1>
                </div>
              ) : null,
              <div key={`calendar-${day.id}`} className="demoPage">
                <Calendar
                  currentDay={day}
                  onPrevDay={handlePrevDay}
                  onNextDay={handleNextDay}
                  loading={loading}
                />
              </div>,
            ].filter((el): el is JSX.Element => el !== null)
          )}
        </HTMLFlipBook>
      )}
    </div>
  );
};

export default Book;
