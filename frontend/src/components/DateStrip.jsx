import React, { useMemo } from 'react';

const DateStrip = ({ selectedDate, onDateChange }) => {
  const dates = useMemo(() => {
    const today = new Date();
    // Build a week centered around today
    const dayOfWeek = today.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);
      result.push({
        dayName: d.toLocaleDateString('en', { weekday: 'short' }),
        date: d.getDate(),
        full: d.toISOString().split('T')[0],
      });
    }
    return result;
  }, []);

  return (
    <div className="flex space-x-3 overflow-x-auto hide-scrollbar py-4 px-6 snap-x">
      {dates.map((d) => {
        const isActive = selectedDate === d.full;
        return (
          <button
            key={d.full}
            onClick={() => onDateChange?.(d.full)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-[60px] h-[80px] rounded-2xl cursor-pointer transition-all snap-center
              ${isActive
                ? 'bg-text-dark text-white shadow-md scale-105'
                : 'bg-white text-text-dark border-gray-100 border shadow-sm hover:bg-gray-50'
              }`}
          >
            <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-text-dark'}`}>
              {d.date}
            </span>
            <span className={`text-xs mt-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
              {d.dayName}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DateStrip;
