import store from '../store';
import { advanceTime } from '../store/slices/gameSlice';

class TimeManager {
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly TICK_RATE = 1000; // מילישניות בין כל טיק

  startGameLoop() {
    if (this.timer) return;
    
    this.timer = setInterval(() => {
      const state = store.getState();
      if (!state.game.isPaused) {
        store.dispatch(advanceTime());
      }
    }, this.TICK_RATE);
  }

  stopGameLoop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const timeManager = new TimeManager(); 