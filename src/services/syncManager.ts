import store from '../store';
import { saveManager } from './saveManager';

interface SyncAction {
  id: string;
  type: 'MAKE_TRANSFER' | 'UPDATE_PLAYER' | 'FINANCIAL_TRANSACTION';
  payload: any;
  timestamp: string;
}

class SyncManager {
  private readonly SYNC_QUEUE_KEY = 'OFFLINE_SYNC_QUEUE';
  private readonly DB_NAME = 'FootballAgentDB';
  private db: IDBDatabase | null = null;

  async initialize() {
    await this.openDatabase();
    await this.processPendingActions();
  }

  private async openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // יצירת טבלאות
        if (!db.objectStoreNames.contains('gameState')) {
          db.createObjectStore('gameState', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('players')) {
          db.createObjectStore('players', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('transfers')) {
          db.createObjectStore('transfers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('finances')) {
          db.createObjectStore('finances', { keyPath: 'id' });
        }
      };
    });
  }

  async addToSyncQueue(action: Omit<SyncAction, 'id' | 'timestamp'>) {
    const syncAction: SyncAction = {
      id: Date.now().toString(),
      ...action,
      timestamp: new Date().toISOString()
    };

    await this.saveToStore('syncQueue', syncAction);
    this.attemptSync();
  }

  private async saveToStore(storeName: string, data: any) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private async processPendingActions() {
    if (!navigator.onLine) return;

    const actions = await this.getAllFromStore('syncQueue');
    for (const action of actions) {
      try {
        await this.processAction(action);
        await this.removeFromStore('syncQueue', action.id);
      } catch (error) {
        console.error('Failed to process action:', error);
      }
    }
  }

  private async processAction(action: SyncAction) {
    switch (action.type) {
      case 'MAKE_TRANSFER':
        await this.processTransfer(action.payload);
        break;
      case 'UPDATE_PLAYER':
        await this.processPlayerUpdate(action.payload);
        break;
      case 'FINANCIAL_TRANSACTION':
        await this.processFinancialTransaction(action.payload);
        break;
    }
  }

  private async getAllFromStore(storeName: string): Promise<SyncAction[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private async removeFromStore(storeName: string, id: string) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.processPendingActions();
    });

    window.addEventListener('offline', () => {
      saveManager.saveGame();
    });
  }

  private async attemptSync() {
    if (navigator.onLine) {
      await this.processPendingActions();
    }
  }

  private async processTransfer(payload: any) {
    // לוגיקה לעיבוד העברה
    const { transferId, playerId, amount } = payload;
    // כאן תהיה הלוגיקה הספציפית לעיבוד העברה
  }

  private async processPlayerUpdate(payload: any) {
    // לוגיקה לעדכון שחקן
    const { playerId, updates } = payload;
    // כאן תהיה הלוגיקה הספציפית לעדכון שחקן
  }

  private async processFinancialTransaction(payload: any) {
    // לוגיקה לעיבוד עסקה פיננסית
    const { transactionId, amount, type } = payload;
    // כאן תהיה הלוגיקה הספציפית לעיבוד עסקה
  }
}

export const syncManager = new SyncManager(); 