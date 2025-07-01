export type Listener = (...args: any[]) => void;
export type CancelSubscription = (event: string, fn: Listener) => void;
export class LocalEventEmitter {
  private listeners = {};

  addListener(event: string, fn: Listener) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
    return () => this.removeListener(event, fn);
  }

  removeListener(event: string, fn: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== fn,
    );
  }

  emit(event: string, ...params: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((listener: Listener) => listener(...params));
  }
}
