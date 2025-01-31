import fs from 'fs';
import path from 'path';

const MESSAGES = [
  "今日という日を大切に",
  "一歩一歩前進しよう",
  "新しい発見の日になりますように",
  "感謝の気持ちを忘れずに",
  "チャレンジする勇気を持とう",
  "笑顔で過ごす一日に",
  "小さな幸せを見つけよう",
  "今できることを精一杯",
  "明日への希望を持って",
  "新たな可能性を信じて",
  "一期一会を大切に",
  "夢に向かって前進しよう",
  "今日も一日頑張ろう",
  "素直な心で向き合おう",
  "自分らしく生きよう",
  "周りの人々に感謝",
  "今を大切に生きる",
  "明日はきっといい日",
  "できることから始めよう",
  "希望を持って進もう"
];

const IMAGES = [
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8", // 日の出
  "https://images.unsplash.com/photo-1682686580391-615b1f28e5ee", // 森林
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1", // 山々
  "https://images.unsplash.com/photo-1540206395-68808572332f", // 海
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9", // 花畑
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // ビーチ
  "https://images.unsplash.com/photo-1476820865390-c52aeebb9891", // 紅葉
  "https://images.unsplash.com/photo-1491466424936-e304919aada7", // 桜
  "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8", // 星空
  "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f", // 雪景色
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86", // 都市
  "https://images.unsplash.com/photo-1511497584788-876760111969", // 森
  "https://images.unsplash.com/photo-1492136344046-866c85e0bf04", // 湖
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // 山と湖
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470"  // 道
];

function generateCalendarData() {
  const days = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    days.push({
      id: currentDate.toISOString().split('T')[0],
      date: currentDate.toISOString().split('T')[0],
      imageUrl: IMAGES[Math.floor(Math.random() * IMAGES.length)],
      message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    });
  }

  const calendarData = { days };
  
  // Write to JSON file
  fs.writeFileSync(
    path.join(__dirname, '../data/calendar-data.json'),
    JSON.stringify(calendarData, null, 2)
  );
}

generateCalendarData();