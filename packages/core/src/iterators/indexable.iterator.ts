import { IEnumerator } from '../enumerator';
import { ArgumentException, ArgumentNullException } from '../exceptions';
import { isNil } from '../utils';

export type IndexableIterable<T> = {
  length: number;
  [key: number]: T;
} & Iterable<T>;

/**
 * Represents an iterator whose
 * source can be indexed by an
 * incrementing number.
 */
export class IndexableIterator<T> implements IEnumerator<T> {
  public get current(): T {
    return this._source[this._idx];
  }

  private _source: IndexableIterable<T>;
  private _idx: number = -1;

  constructor(source: IndexableIterable<T>) {
    if (isNil(source)) {
      throw new ArgumentNullException('source');
    }

    if (isNil(source.length)) {
      throw new ArgumentException('Source does not have a length property');
    }

    this._source = source;
  }

  public moveNext(): boolean {
    this._idx++;
    if (this._idx >= this._source.length) {
      return false;
    }

    return true;
  }

  public reset(): void {
    this._idx = -1;
  }

  public [Symbol.iterator](): Iterator<T> {
    return this._source[Symbol.iterator]();
  }
}
