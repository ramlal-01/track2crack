import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReminderModal = ({ 
  openReminderId, 
  progressMap, 
  handleReminderChange, 
  darkMode 
}) => {
  if (!openReminderId) return null;

  const progress = progressMap[openReminderId] || {};

  return (
    <div className={`absolute z-50 mt-2 ${
      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
    } border shadow-lg rounded p-2`}>
      <DatePicker
        selected={progress.remindOn ? new Date(progress.remindOn) : null}
        onChange={(date) => handleReminderChange(openReminderId, date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Pick a date"
        minDate={new Date()}
        inline
        className={darkMode ? 'dark:bg-gray-700' : ''}
      />
      {progress.remindOn && (
        <button
          onClick={() => handleReminderChange(openReminderId, null)}
          className={`text-xs ${
            darkMode ? 'text-red-400' : 'text-red-500'
          } mt-2 font-semibold transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-sm block w-full text-center`}
        >
          Clear Reminder
        </button>
      )}
    </div>
  );
};

export default ReminderModal;