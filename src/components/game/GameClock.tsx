import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/dateUtils';

const GameClock = () => {
  const { currentDate, gameSpeed, isPaused } = useSelector((state: RootState) => state.game);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg p-4"
    >
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-1">תאריך נוכחי</div>
        <div className="text-xl font-bold text-white">
          {formatDate(currentDate)}
        </div>
        <div className="flex items-center justify-center mt-2 space-x-2">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500'}`} />
          <div className="text-sm text-gray-400">
            {isPaused ? 'מושהה' : `מהירות: x${gameSpeed}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameClock; 