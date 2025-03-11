import React, { useEffect, useState } from "react";
import { CalendarDay } from "../types";
import { isToday } from "../utils/dateUtils";
import CountdownTimer from "./CountdownTimer";
import { imagelength, messages } from "../data/data";
import { images } from "../data/data";

interface CalendarProps {
  currentDay?: CalendarDay;
  onPrevDay: () => void;
  onNextDay: () => void;
  loading?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDay,
  onPrevDay,
  onNextDay,
  loading = false,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !currentDay) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <h1 className="text-white text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  // 残り日数計算
  const eventDate = new Date("2025-11-29");
  const remainingDays = Math.ceil(
    (eventDate.getTime() - currentDay.date.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 画像とメッセージの取得
  const index_img = currentDay.id % imagelength;
  const index_msg = currentDay.id % messages.length;
  const formatMessage = (message: string, chunkSize: number = 15) => {
    const result = [];
    let currentChunk = "";

    for (let i = 0; i < message.length; i++) {
      currentChunk += message[i];

      // 句読点またはスペースで改行
      if (
        (message[i] === "。" || message[i] === "、" || message[i] === "　") &&
        currentChunk.length >= 8
      ) {
        result.push(currentChunk);
        currentChunk = "";
      }
      // 15文字以上なら強制改行
      else if (currentChunk.length >= chunkSize) {
        result.push(currentChunk);
        currentChunk = "";
      }
    }

    // 残りの文字を追加
    if (currentChunk) {
      result.push(currentChunk);
    }

    return result;
  };

  const messageLines = formatMessage(messages[index_msg][0], 15);
  const messageSignature = formatMessage(messages[index_msg][1], 16);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center relative overflow-hidden h-full bg-black font-kaisei"
      style={{
        backgroundImage: `url(/img/photo${index_img + 1}.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 斜めの色付きオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-blue-500/40 "></div>
      <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-r from-pink-500/30 to-white-500/50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-500/50 to-white-500/50"></div>
      {/* 左上の日時表示 */}
      <div className="absolute top-12 sm:top-4 left-4 text-white text-base sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold leading-loose md:leading-[2] lg:leading-[2.5] xl:leading-[3]">
        <p className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-4xl mb-2">
          {currentDay.date
            .toLocaleDateString("en-US", { weekday: "long" })
            .toUpperCase()}
        </p>
        <p className="text-4xl sm:text-2xl md:text-4xl lg:text-6xl xl:text-6xl mb-2">
          {currentDay.date
            .toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .toUpperCase()}
        </p>
        <p className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-5xl mb-2">
          -
          {time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          -
        </p>
      </div>
      {/* 右上に縦書きメッセージ（原稿用紙風表示） */}
      <div
        className="absolute top-12 sm:top-4 right-4 font-medium text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl  border-black border-double p-6 bg-white font-kaisei tracking-wide"
        style={{
          display: "inline-block",
          writingMode: "vertical-rl",
          backgroundImage:
            "linear-gradient(180deg,rgb(255, 255, 255),rgb(255, 255, 255))",
          backgroundClip: "text",
          color: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {messageLines.map((line, index) => (
          <p
            key={index}
            className="mb-32"
            style={{
              marginTop: `${index * 4}rem`,
              paddingRight: "0.2rem",
              lineHeight: "1.5",
            }}
          >
            {line}
          </p>
        ))}
        {messageSignature.map((line, index) => (
          <p
            key={index}
            className="mb-32 text-lg"
            style={{
              marginTop: `${(messageLines.length + index + 4) * 2}rem`,
              paddingRight: "0.2rem",
              lineHeight: "1.5",
            }}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="absolute bottom-8 sm:bottom-1 left-4 text-white text-base font-medium opacity-80 font-yuji">
        &copy; Doshisha University
      </div>

      {/* カウントダウンタイマー */}
      <CountdownTimer />
    </div>
  );
};

export default Calendar;
