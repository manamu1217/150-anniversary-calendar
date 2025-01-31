import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import { useCalendarData } from "./hooks/useCalendarData";

function App() {
  const { loading, error } = useCalendarData();
  const [days, setDays] = useState<{ id: number; date: Date }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (days.length === 0) {
      // 初回のみ20日分の日付を生成
      const baseDate: Date = new Date(2024, 0, 1);
      const today: Date = new Date();

      // 2つの日付の差を計算 (ミリ秒単位)
      const diffTime: number = today.getTime() - baseDate.getTime();
      const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // 当日から20日前までの日付を生成
      const newDays = [];
      for (let i = diffDays - 19; i <= diffDays; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);

        newDays.push({
          id: i,
          date: date,
        });
      }

      setDays(newDays);
      setCurrentIndex(newDays.length - 1); // 最新の日付を `currentIndex` に設定
    }
  }, []);

  function getAdditonalDays() {
    if (days.length === 0) return;

    const currentid = days[0].id;
    console.log("Current ID:", currentid);

    const baseDate: Date = new Date(2024, 0, 1);
    const date = new Date(baseDate);
    date.setDate(date.getDate() + currentid - 1);

    const newDay = {
      id: currentid - 1,
      date: date,
      imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
      message: "チャレンジする勇気を持とう2",
    };

    setDays((prevDays) => [newDay, ...prevDays]);
    setCurrentIndex(0);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const handlePrevDay = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      getAdditonalDays();
    }
  };

  const handleNextDay = () => {
    const today = new Date();
    const currentDate = days[currentIndex]?.date;

    if (
      currentDate &&
      currentIndex < days.length - 1 &&
      days[currentIndex + 1].date <= today
    ) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <Calendar
      currentDay={days[currentIndex]}
      onPrevDay={handlePrevDay}
      onNextDay={handleNextDay}
      loading={loading}
    />
  );
}

export default App;
