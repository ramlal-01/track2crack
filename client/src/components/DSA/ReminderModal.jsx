import React from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReminderModal = ({ 
  openReminderId, 
  progressMap, 
  darkMode, 
  handleReminderChange, 
  onClose // optional, for overlay click
}) => {
  if (!openReminderId) return null;

  const progress = progressMap[openReminderId] || {};

  // Modal content
  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30" onClick={onClose}>
      <div 
        data-modal="reminder"
        className={`relative z-[100000] ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border shadow-xl rounded-lg p-4 min-w-[280px]`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`${darkMode ? 'dark-datepicker' : ''}`}>
          <DatePicker
            selected={progress.remindOn ? new Date(progress.remindOn) : null}
            onChange={(date) => handleReminderChange(openReminderId, date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Pick a date"
            minDate={new Date()}
            inline
            className={darkMode ? 'dark:bg-gray-700 dark:text-white' : ''}
            calendarClassName={darkMode ? 'dark-calendar' : ''}
          />
        </div>
        {progress.remindOn && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Reminder set for: <span className="font-semibold text-blue-600 dark:text-blue-400">
                {new Date(progress.remindOn).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReminderChange(openReminderId, null);
              }}
              className={`w-full text-xs py-2 px-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'text-red-400 bg-red-900/20 hover:bg-red-900/40 border border-red-800' 
                  : 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
              } hover:scale-105`}
            >
              Clear Reminder
            </button>
          </div>
        )}
        {/* Dark mode styles for DatePicker */}
        <style jsx>{`
          .dark-datepicker .react-datepicker {
            background-color: #374151 !important;
            border-color: #4b5563 !important;
            color: #f9fafb !important;
          }
          .dark-datepicker .react-datepicker__header {
            background-color: #4b5563 !important;
            border-bottom-color: #6b7280 !important;
          }
          .dark-datepicker .react-datepicker__current-month,
          .dark-datepicker .react-datepicker__day-name {
            color: #f9fafb !important;
          }
          .dark-datepicker .react-datepicker__day {
            color: #d1d5db !important;
          }
          .dark-datepicker .react-datepicker__day:hover {
            background-color: #6366f1 !important;
            color: #ffffff !important;
          }
          .dark-datepicker .react-datepicker__day--selected {
            background-color: #4f46e5 !important;
            color: #ffffff !important;
          }
          .dark-datepicker .react-datepicker__day--today {
            background-color: #1f2937 !important;
            color: #60a5fa !important;
          }
          .dark-datepicker .react-datepicker__navigation {
            border-color: #9ca3af !important;
          }
          .dark-datepicker .react-datepicker__navigation:hover {
            border-color: #f9fafb !important;
          }
          .dark-datepicker .react-datepicker__day--disabled {
            color: #6b7280 !important;
          }
        `}</style>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ReminderModal;