export {};

declare global {
  interface Window {
    initCustomCursor?: () => void;
    useTweaks?: <T extends Record<string, unknown>>(
      defaults: T
    ) => [T, (key: string | Partial<T>, value?: unknown) => void];
  }
}
