import { IEnumerator } from '@core//enumerator';

import { EnumerableSource, IteratorFunction } from '../types';
import { isNil } from '../utils';

export class IterableEnumerator<T> implements IEnumerator<T> {
  public current?: T;
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
  }

  moveNext(): boolean {
    const { done, value } = this._iterator.next();

    if (!isNil(done) && done === true) {
      return false;
    }

    this.current = value;
    return true;
  }

  reset(): void {
    this._iterator = this._iteratorSource();
  }

  [Symbol.iterator](): Iterator<T> {
    return this._iterator;
  }

  private _isIterator(iterator: Iterator<T>) {
    return typeof iterator?.next === 'function';
  }
}
