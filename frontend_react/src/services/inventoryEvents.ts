// Simple event system for inventory updates

type InventoryEventCallback = () => void;

const REFRESH_KEY = 'omnishelf_inventory_refresh';

class InventoryEventEmitter {
  private listeners: InventoryEventCallback[] = [];

  subscribe(callback: InventoryEventCallback): () => void {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  emit(): void {
    // Notify all in-memory listeners
    this.listeners.forEach(callback => callback());
    // Also set a flag in localStorage for components that mount later
    localStorage.setItem(REFRESH_KEY, Date.now().toString());
  }

  // Check if a refresh is needed (for components that just mounted)
  checkPendingRefresh(): boolean {
    const lastRefresh = localStorage.getItem(REFRESH_KEY);
    if (lastRefresh) {
      // Clear the flag
      localStorage.removeItem(REFRESH_KEY);
      return true;
    }
    return false;
  }
}

export const inventoryEvents = new InventoryEventEmitter();
