import Calendar from 'react-calendar';
import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

const MiniCalendar = ({ onDateSelect, reminderDates = [] }) => {
  const [value, setValue] = useState(new Date());

  const handleDateChange = (date) => {
    setValue(date);
    onDateSelect(date);
    console.log("📅 Selected Date:", date);
  };
// 
  return (
    <div className="mini-calendar-wrapper">
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={({ date, view }) => {
          const isoDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
          if (view === 'month' && reminderDates.includes(isoDate)) {
            return (
              <div className="flex justify-center mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              </div>
            );
          }
          return null;
        }}
        className="rounded-lg shadow border border-gray-300"
      />
    </div>
  );
};

export default MiniCalendar;
