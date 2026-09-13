// High-performance Auto Scroll controller for cinematic playback

export type AutoScrollListener = (isActive: boolean) => void;

class AutoScrollManager {
  private isRunning = false;
  private rafId: number | null = null;
  private lastTime = 0;
  private listeners: Set<AutoScrollListener> = new Set();
  private durationSeconds = 42; // ~42 seconds for 1,311 frames (~31 fps cinematic feel)

  constructor() {
    if (typeof window !== "undefined") {
      // Pause auto-scroll on manual user intervention
      window.addEventListener("wheel", this.handleUserInterrupt, { passive: true });
      window.addEventListener("touchstart", this.handleUserInterrupt, { passive: true });
      window.addEventListener("keydown", this.handleKeyInterrupt, { passive: true });
    }
  }

  public subscribe(fn: AutoScrollListener) {
    this.listeners.add(fn);
    fn(this.isRunning);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isRunning));
  }

  private handleUserInterrupt = () => {
    if (this.isRunning) {
      this.stop();
    }
  };

  private handleKeyInterrupt = (e: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
      if (this.isRunning) {
        this.stop();
      }
    }
  };

  public get isActive() {
    return this.isRunning;
  }

  private currentPos = 0;

  public start(customDurationSeconds?: number) {
    if (customDurationSeconds) {
      this.durationSeconds = customDurationSeconds;
    }

    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.notify();

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );
    if (window.scrollY >= maxScroll - 5) {
      // If already at the end, restart from top
      window.scrollTo(0, 0);
      this.currentPos = 0;
    } else {
      this.currentPos = window.scrollY;
    }

    this.tick();
  }

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.notify();
  }

  public toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  private tick = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1); // Clamp dt to prevent huge jumps on tab switch
    this.lastTime = now;

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );
    if (maxScroll <= 0) {
      this.stop();
      return;
    }

    // Scroll speed: pixels per second = total distance / total duration
    const speed = maxScroll / this.durationSeconds;
    this.currentPos += speed * dt;

    if (this.currentPos >= maxScroll - 1) {
      window.scrollTo(0, maxScroll);
      this.stop();
      return;
    }

    window.scrollTo(0, this.currentPos);
    this.rafId = requestAnimationFrame(this.tick);
  };
}

export const autoScroll = typeof window !== "undefined" ? new AutoScrollManager() : ({} as AutoScrollManager);
