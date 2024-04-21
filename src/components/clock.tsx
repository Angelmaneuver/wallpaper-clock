import { useState } from 'react';

const INTERVAL = 60 as const;

const DAYS = [
  '日曜日',
  '月曜日',
  '火曜日',
  '水曜日',
  '木曜日',
  '金曜日',
  '土曜日',
] as const;

function Clock({ className }: { className?: string }) {
  const [datetime, upDatetime] = useState(Date.now());

  const date = new Date(datetime);

  function setDate(time: number): void {
    upDatetime(time);

    date.setTime(time);
  }

  setTimeout(
    () => {
      setDate(Date.now());

      setInterval(() => setDate(Date.now()), INTERVAL * 1000);
    },
    (INTERVAL - date.getSeconds()) * 1000,
  );

  return (
    <div
      className={`flex flex-col justify-items-center text-primary-foreground antialiased select-none ${
        className ? className : ''
      }`.trim()}
    >
      <span className="text-2xl font-medium text-center">
        {date.getMonth() + 1}月{padding(date.getDate())}日 {DAYS[date.getDay()]}
      </span>
      <span className="text-6xl lg:text-8xl font-bold text-center">
        {date.getHours().toString()}:{padding(date.getMinutes())}
      </span>
    </div>
  );
}

function padding(value: number, digits = 2): string {
  return value.toString().padStart(digits, '0');
}

export default Clock;
