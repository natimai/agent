import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaForward, FaCalendarAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { gameTimeManager } from '../../services/gameTimeManager';
import './TimeControls.css';

const TimeControls = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { currentDate, gameSpeed, isPaused } = useSelector((state: RootState) => state.game);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAdvanceDay = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const wasPaused = isPaused;
    if (!wasPaused) {
      gameTimeManager.togglePause(true);
    }
    
    try {
      await gameTimeManager.advanceOneDay();
    } catch (error) {
      console.error('שגיאה בהתקדמות יום:', error);
      // TODO: הוספת הודעת שגיאה למשתמש
    }
    
    if (!wasPaused) {
      gameTimeManager.togglePause(false);
    }
    setIsProcessing(false);
    setIsOpen(false);
  };

  const handleAdvanceWeek = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const wasPaused = isPaused;
    if (!wasPaused) {
      gameTimeManager.togglePause(true);
    }
    
    try {
      await gameTimeManager.advanceOneWeek();
    } catch (error) {
      console.error('שגיאה בהתקדמות שבוע:', error);
      // TODO: הוספת הודעת שגיאה למשתמש
    }
    
    if (!wasPaused) {
      gameTimeManager.togglePause(false);
    }
    setIsProcessing(false);
    setIsOpen(false);
  };

  const handleTogglePause = () => {
    if (isProcessing) return;
    gameTimeManager.togglePause(!isPaused);
    setIsOpen(false);
  };

  const handleSpeedChange = (speed: number) => {
    if (isProcessing) return;
    gameTimeManager.setSpeed(speed as 1 | 2 | 3 | 4);
  };

  const timeControls = [
    {
      icon: isPaused ? FaPlay : FaPause,
      color: 'text-green-500',
      onClick: handleTogglePause,
      label: isPaused ? 'המשך משחק' : 'עצור משחק'
    },
    {
      icon: FaForward,
      color: 'text-blue-500',
      onClick: handleAdvanceDay,
      label: 'יום הבא'
    },
    {
      icon: FaCalendarAlt,
      color: 'text-yellow-500',
      onClick: handleAdvanceWeek,
      label: 'שבוע הבא'
    }
  ];

  return (
    <div className="time-controls-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="time-controls-menu"
          >
            {timeControls.map((control, index) => (
              <motion.button
                key={index}
                className={`time-control-button ${control.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={control.onClick}
                disabled={isProcessing}
                title={control.label}
              >
                <control.icon size={20} />
                <span className="time-control-tooltip">{control.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="time-control-toggle"
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FaTimes size={24} /> : <FaPlus size={24} />}
      </motion.button>
    </div>
  );
};

export default TimeControls; 