import { IEnumerator } from './enumerator.interface';
import { EnumerableSource, IteratorFunction } from './types';
import { isNil } from './utils/is-nil';

export class Enumerator<T> implements IEnumerator<T> {
  public current: T | null;
  private _iteratorSource: IteratorFunction<T>;
  private _iterator: Iterator<T>;

  constructor(source: EnumerableSource<T>) {
    if (isNil(source)) {
      throw new Error('Enumerator source is not defined');
    }

    const isIteratorFn = typeof source === 'function';

    if (!isIteratorFn && isNil(source[Symbol.iterator])) {
      throw new Error('Enumerator source is not an iterator');
    }

    if (isIteratorFn) {
      this._iteratorSource = <IteratorFunction<T>>source;
    } else {
      this._iteratorSource = source[Symbol.iterator].bind(source);
    }

    // We need to bind the iterator function to the source instance
    // of course, if the source changes, the iterator will change as well
    // if it is reset.
    this._iterator = this._iteratorSource();

    if (!this._isIterator(this._iterator)) {
      throw new Error('Enumerator source did not return an iterator');
    }

    this.current = null;
  }

  public moveNext(): boolean {
    const { done, value } = this._iterator.next();

    if (!isNil(done) && done === true) {
      return false;
    }

    this.current = value;
    return true;
  }

  public reset(): void {
    this._iterator = this._iteratorSource();
  }

  public getIterator(): Iterator<T> {
    return this._iterator;
  }

  public [Symbol.iterator](): Iterator<T> {
    return this._iteratorSource();
  }

  private _isIterator(iterator: Iterator<T>) {
    return typeof iterator?.next === 'function';
  }
}
