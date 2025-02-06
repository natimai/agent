import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { advanceTime } from '../store/slices/gameSlice';

const TICK_INTERVAL = 1000; // מילישניות

export const useGameTimer = () => {
  const dispatch = useDispatch();
  const { isPaused } = useSelector((state: RootState) => state.game);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        dispatch(advanceTime());
      }, TICK_INTERVAL);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, dispatch]);
}; 