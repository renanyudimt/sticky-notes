export interface Debounced<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
}
