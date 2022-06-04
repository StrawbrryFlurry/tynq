export interface IAsyncEnumerator<T> {
  current?: T;
  moveNextAsync(): Promise<boolean>;
  reset(): void;
}
