import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveManager } from '../../services/saveManager';
import { loadSavedGame } from '../../store/slices/gameSlice';

const SaveLoadMenu = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const handleSave = () => {
    const save = saveManager.saveGame();
    setMessage('המשחק נשמר בהצלחה!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLoad = () => {
    const savedGame = saveManager.loadGame();
    if (savedGame) {
      dispatch(loadSavedGame(savedGame.gameState));
      setMessage('המשחק נטען בהצלחה!');
    } else {
      setMessage('לא נמצאה שמירה קודמת');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        שמור משחק
      </button>
      <button
        onClick={handleLoad}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        טען משחק
      </button>
      {message && (
        <span className="text-sm text-gray-600">{message}</span>
      )}
    </div>
  );
};

export default SaveLoadMenu; 