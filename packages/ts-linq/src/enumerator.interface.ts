/**
 * An alternative implementation of the JavaScript
 * Iterable used by the IEnumerable implementation.
 */
export interface IEnumerator<T> extends Iterable<T> {
  current: T | null;
  moveNext(): boolean;
  reset(): void;
  getIterator(): Iterator<T>;
}
