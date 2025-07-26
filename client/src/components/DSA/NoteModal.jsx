import React from "react";
import { toast } from 'react-toastify';

const NoteModal = ({ 
  openNoteId, 
  noteText, 
  setNoteText, 
  setOpenNoteId, 
  progressMap, 
  updateProgress, 
  setProgressMap, 
  darkMode, 
  darkInput 
}) => {
  if (!openNoteId) return null;

  const progress = progressMap[openNoteId] || {};

  const handleSaveNote = async (e) => {
    e.stopPropagation();
    await updateProgress(openNoteId, { note: noteText });
    setProgressMap((prev) => ({
      ...prev,
      [openNoteId]: {
        ...prev[openNoteId],
        note: noteText
      }
    }));
    toast.success("Note saved!");
    setOpenNoteId(null);
  };

  const handleClearNote = async (e) => {
    e.stopPropagation();
    setNoteText('');
    await updateProgress(openNoteId, { note: '' });
    setProgressMap((prev) => ({
      ...prev,
      [openNoteId]: {
        ...prev[openNoteId],
        note: ''
      }
    }));
    toast.success("Note cleared!");
    setOpenNoteId(null);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setOpenNoteId(null);
  };

  return (
    <div 
      data-modal="note"
      className={`absolute z-50 mt-2 ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      } border shadow-lg rounded p-3 w-64 max-w-[90vw]`}
    >
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        rows={3}
        placeholder="Type your quick note here..."
        className={`w-full p-2 border rounded text-sm ${darkInput}`}
        autoFocus
      />

      {noteText && (
        <button
          onClick={handleClearNote}
          className={`text-xs ${
            darkMode ? 'text-red-400' : 'text-red-500'
          } mt-2 hover:underline`}
        >
          Clear Note
        </button>
      )}

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={handleCancel}
          className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          } hover:underline`}
        >
          Cancel
        </button>
        <button
          onClick={handleSaveNote}
          className={`text-xs px-2 py-1 rounded ${
            noteText === (progress.note || '')
              ? `${darkMode ? 'text-gray-500 border-gray-500' : 'text-gray-400 border-gray-300'} cursor-not-allowed`
              : `${darkMode ? 'text-green-400 border-green-500 hover:bg-gray-600' : 'text-green-600 border-green-500 hover:bg-green-50'}`
          } border`}
          disabled={noteText === (progress.note || '')}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteModal;