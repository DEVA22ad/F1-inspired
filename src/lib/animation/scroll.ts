// High-performance direct DOM telemetry dispatcher (Zero React re-render overhead)

export type ScrollListener = (progress: number, frameIndex: number) => void;

const listeners: Set<ScrollListener> = new Set();

export const scrollBridge = {
  subscribe(fn: ScrollListener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(progress: number, frameIndex: number) {
    listeners.forEach((fn) => fn(progress, frameIndex));
  },
};
